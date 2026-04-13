import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are an English writing coach specializing in helping Japanese speakers and other non-native English speakers.
Given the user's text, return a JSON object with:
{
  "rewritten": "the improved version",
  "changes": [
    {
      "original": "exact phrase from input",
      "replacement": "improved phrase",
      "explanation": "brief, clear reason for the change (1-2 sentences)",
      "explanation_ja": "日本語での簡潔な説明（1-2文）"
    }
  ]
}

Rules:
- Focus on: grammar, naturalness, conciseness, and appropriate tone
- Only fix what needs fixing. Don't rewrite for style if the original is correct
- If the input is in Japanese, translate it to natural English
- Limit changes to the most important 3-5 improvements
- Keep explanations concise and educational
- For Japanese speakers, be aware of common mistakes: article usage (a/the), singular/plural, prepositions, verb tenses
- Always include both English and Japanese explanations
- Respond ONLY with valid JSON, no markdown or code blocks`;

type StyleKey = "casual" | "formal" | "native" | "academic" | "business_email" | "social";

const styleGuide: Record<StyleKey, string> = {
  casual: "Use a friendly, conversational tone. Contractions are encouraged. Keep it relaxed and approachable.",
  formal: "Use a professional, polished tone. Avoid contractions. Maintain formality throughout.",
  native: "Make it sound natural and fluent, as a native speaker would write in everyday situations.",
  academic: "Use scholarly and precise language, suitable for research papers and academic writing. Include appropriate hedging and formal academic vocabulary.",
  business_email: "Use professional email tone that is polite and action-oriented. Include appropriate greetings and closings. Be clear and concise.",
  social: "Use warm and friendly language, great for dating apps or social media. Be engaging and personable while staying natural.",
};

export async function POST(request: Request) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY is not set");
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const { text, targetStyle } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (text.length > 500) {
      return NextResponse.json(
        { error: "Text exceeds 500 character limit (Free tier)" },
        { status: 400 }
      );
    }

    const style = styleGuide[targetStyle as StyleKey] || styleGuide.native;

    const userPrompt = `Target style: ${style}

Text to rewrite:
${text}`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
      system: SYSTEM_PROMPT,
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    // Parse JSON response — strip markdown fences if present
    const raw = content.text.trim();
    const jsonStr = raw.startsWith("```")
      ? raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "")
      : raw;

    let result;
    try {
      result = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("JSON parse error. Raw response:", raw);
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 502 }
      );
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Rewrite error:", error);

    // Forward Anthropic API errors with details
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status || 502 }
      );
    }

    return NextResponse.json(
      { error: "Failed to rewrite text" },
      { status: 500 }
    );
  }
}
