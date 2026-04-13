"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

interface Phrase {
  id: string;
  scene: string;
  japanese: string;
  casual: string;
  formal: string;
  nuance: string;
  category: string;
}

const categories = [
  { id: "all", name: "All", icon: "📋" },
  { id: "daily", name: "Daily Life", icon: "🏠" },
  { id: "business", name: "Business", icon: "🏢" },
  { id: "academic", name: "Academic", icon: "🎓" },
  { id: "social", name: "Social", icon: "🍷" },
  { id: "travel", name: "Travel", icon: "✈️" },
];

const phrases: Phrase[] = [
  // Daily Life
  {
    id: "1",
    scene: "At restaurant",
    japanese: "お会計お願いします",
    casual: "Can I get the check?",
    formal: "Could I have the bill, please?",
    nuance: '"check" is American, "bill" is British',
    category: "daily",
  },
  {
    id: "2",
    scene: "Asking directions",
    japanese: "この辺にコンビニありますか？",
    casual: "Is there a convenience store nearby?",
    formal:
      "Would you happen to know if there's a convenience store in this area?",
    nuance: 'In NYC, say "bodega" for corner stores',
    category: "daily",
  },
  {
    id: "3",
    scene: "Declining politely",
    japanese: "ちょっと今日は厳しいです",
    casual: "I can't make it today, sorry!",
    formal: "I'm afraid I won't be able to make it today.",
    nuance:
      "Avoid direct \"no\" - soften with \"I'm afraid\" or \"unfortunately\"",
    category: "daily",
  },
  {
    id: "4",
    scene: "Complimenting food",
    japanese: "これ美味しい！",
    casual: "This is so good!",
    formal: "This is absolutely delicious.",
    nuance: '"Yummy" sounds childish in adult conversation',
    category: "daily",
  },
  {
    id: "5",
    scene: "Asking for recommendations",
    japanese: "おすすめは何ですか？",
    casual: "What do you recommend?",
    formal: "What would you suggest?",
    nuance: "Both work well; casual is more common at restaurants",
    category: "daily",
  },
  {
    id: "6",
    scene: "Running late",
    japanese: "ちょっと遅れます！",
    casual: "Running a bit late!",
    formal: "I apologize, but I'll be arriving a few minutes late.",
    nuance: '"Running late" is the most natural casual phrase',
    category: "daily",
  },

  // Business
  {
    id: "7",
    scene: "Email opening",
    japanese: "お忙しいところ恐れ入りますが",
    casual: "Hey, quick question...",
    formal:
      "I hope this email finds you well. I wanted to reach out regarding...",
    nuance: "Formal version is standard in US business emails",
    category: "business",
  },
  {
    id: "8",
    scene: "Scheduling a meeting",
    japanese: "お時間いただけますか？",
    casual: "Got a few minutes to chat?",
    formal: "Would you be available for a brief meeting?",
    nuance: '"Circle back" and "touch base" are common business jargon',
    category: "business",
  },
  {
    id: "9",
    scene: "Following up",
    japanese: "先日の件、いかがでしょうか？",
    casual: "Any updates on that?",
    formal: "I wanted to follow up on our previous discussion.",
    nuance: 'Avoid sounding pushy - "gentle reminder" works well',
    category: "business",
  },
  {
    id: "10",
    scene: "Expressing disagreement",
    japanese: "ちょっと違うと思います",
    casual: "I see it differently.",
    formal: "I'd like to offer a different perspective.",
    nuance:
      "Never say \"You're wrong\" - always frame as your own perspective",
    category: "business",
  },
  {
    id: "11",
    scene: "Asking for feedback",
    japanese: "ご意見いただけますか？",
    casual: "What do you think?",
    formal: "I would greatly appreciate your feedback.",
    nuance: '"Thoughts?" alone is common in casual business settings',
    category: "business",
  },
  {
    id: "12",
    scene: "Closing email",
    japanese: "よろしくお願いいたします",
    casual: "Thanks!",
    formal: "Thank you for your time and consideration.",
    nuance:
      '"Best regards" is safe; "Cheers" is UK/casual; avoid "Best" alone',
    category: "business",
  },

  // Academic
  {
    id: "13",
    scene: "Introducing argument",
    japanese: "本稿では〜を論じる",
    casual: "This paper talks about...",
    formal: "This paper examines / argues that...",
    nuance: 'Avoid "talks about" - use "examines", "explores", "investigates"',
    category: "academic",
  },
  {
    id: "14",
    scene: "Citing sources",
    japanese: "〜によると",
    casual: "According to Smith...",
    formal: "As Smith (2024) demonstrates...",
    nuance: '"demonstrates" is stronger than "says" or "shows"',
    category: "academic",
  },
  {
    id: "15",
    scene: "Hedging claims",
    japanese: "〜と考えられる",
    casual: "It seems like...",
    formal: "It can be argued that... / Evidence suggests that...",
    nuance:
      'Academic writing requires hedging - avoid absolute statements like "X is"',
    category: "academic",
  },
  {
    id: "16",
    scene: "Asking professor",
    japanese: "質問があるのですが",
    casual: "I have a question about...",
    formal: "I was wondering if I could ask you about...",
    nuance:
      'Use "I was wondering" for politeness; office hours are called "office hours"',
    category: "academic",
  },
  {
    id: "17",
    scene: "Requesting extension",
    japanese: "締め切りを延ばしていただけますか",
    casual: "Any chance I could get an extension?",
    formal:
      "I was wondering if it would be possible to request an extension due to...",
    nuance: "Always provide a reason; be apologetic but not excessive",
    category: "academic",
  },

  // Social
  {
    id: "18",
    scene: "Dating app opener",
    japanese: "趣味が合いそうですね",
    casual: "I noticed we both like... - that's awesome!",
    formal:
      "I see we share an interest in... I'd love to hear more about that.",
    nuance: "Be specific about what caught your attention; avoid generic \"hey\"",
    category: "social",
  },
  {
    id: "19",
    scene: "Asking someone out",
    japanese: "今度一緒にどうですか？",
    casual: "Wanna grab coffee sometime?",
    formal: "Would you like to get coffee sometime?",
    nuance:
      '"Grab coffee" is low-pressure; "dinner" implies more romantic intent',
    category: "social",
  },
  {
    id: "20",
    scene: "Complimenting appearance",
    japanese: "素敵ですね",
    casual: "You look great!",
    formal: "You look wonderful.",
    nuance:
      'Avoid commenting on body parts directly; "You look great" is always safe',
    category: "social",
  },
  {
    id: "21",
    scene: "Ending conversation gracefully",
    japanese: "そろそろ失礼します",
    casual: "I should probably get going.",
    formal: "It was lovely talking with you, but I should be going.",
    nuance: '"I should get going" is neutral and not rude',
    category: "social",
  },
  {
    id: "22",
    scene: "Responding to compliment",
    japanese: "いえいえ、そんな",
    casual: "Thanks! That's sweet of you.",
    formal: "Thank you, that's very kind of you to say.",
    nuance:
      'Accept compliments gracefully - Japanese-style deflection ("No, no") sounds odd',
    category: "social",
  },

  // Travel
  {
    id: "23",
    scene: "At hotel check-in",
    japanese: "チェックインお願いします",
    casual: "Hi, checking in for [name].",
    formal: "Good afternoon, I have a reservation under [name].",
    nuance: 'Just say your name - no need for "My name is"',
    category: "travel",
  },
  {
    id: "24",
    scene: "Asking about WiFi",
    japanese: "WiFiのパスワードを教えてください",
    casual: "What's the WiFi password?",
    formal: "Could you please share the WiFi password?",
    nuance: '"What\'s the WiFi?" alone is understood',
    category: "travel",
  },
  {
    id: "25",
    scene: "Requesting taxi",
    japanese: "タクシーを呼んでもらえますか？",
    casual: "Could you call me a cab?",
    formal: "Would it be possible to arrange a taxi?",
    nuance: '"Cab" and "taxi" are interchangeable in the US; use Uber/Lyft',
    category: "travel",
  },
  {
    id: "26",
    scene: "At security checkpoint",
    japanese: "これは機内持ち込みできますか？",
    casual: "Can I take this through?",
    formal: "Is this item permitted in carry-on luggage?",
    nuance: '"TSA" is US security; "carry-on" not "hand luggage" in US',
    category: "travel",
  },
  {
    id: "27",
    scene: "Asking for help",
    japanese: "すみません、道に迷いました",
    casual: "Excuse me, I'm a bit lost.",
    formal: "Pardon me, I seem to have lost my way.",
    nuance: '"I\'m lost" is direct and works fine; "a bit" softens it',
    category: "travel",
  },
];

// Speech synthesis helper
const speak = (text: string) => {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
};

export default function LibraryPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredPhrases = useMemo(() => {
    return phrases.filter((phrase) => {
      const matchesCategory =
        selectedCategory === "all" || phrase.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        phrase.japanese.toLowerCase().includes(searchQuery.toLowerCase()) ||
        phrase.casual.toLowerCase().includes(searchQuery.toLowerCase()) ||
        phrase.formal.toLowerCase().includes(searchQuery.toLowerCase()) ||
        phrase.scene.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleTryInRewrite = (text: string) => {
    router.push(`/?text=${encodeURIComponent(text)}`);
  };

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-[var(--foreground)] text-center mb-2">
          Phrase Library
        </h1>
        <p className="text-center text-[var(--muted)] mb-8">
          場面別のネイティブ表現集
        </p>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search phrases... (Japanese or English)"
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === category.id
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--card)] text-[var(--muted)] hover:bg-[var(--card-hover)]"
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Phrase Cards */}
        <div className="space-y-4">
          {filteredPhrases.length === 0 ? (
            <div className="text-center py-12 text-[var(--muted)]">
              No phrases found. Try a different search or category.
            </div>
          ) : (
            filteredPhrases.map((phrase) => {
              const isExpanded = expandedId === phrase.id;
              const categoryInfo = categories.find(
                (c) => c.id === phrase.category
              );

              return (
                <div
                  key={phrase.id}
                  className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden transition-all duration-200 hover:border-[var(--accent)]/50"
                >
                  {/* Card Header - Always Visible */}
                  <button
                    onClick={() =>
                      setExpandedId(isExpanded ? null : phrase.id)
                    }
                    className="w-full p-4 text-left cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm">
                            {categoryInfo?.icon}
                          </span>
                          <span className="text-sm text-[var(--muted)]">
                            {phrase.scene}
                          </span>
                        </div>
                        <p className="text-[var(--foreground)] font-medium mb-1">
                          {phrase.japanese}
                        </p>
                        <p className="text-[var(--accent)]">
                          → &quot;{phrase.casual}&quot;
                        </p>
                      </div>
                      <span
                        className={`text-[var(--muted)] transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      >
                        ▼
                      </span>
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-[var(--border)] pt-4">
                      <div className="space-y-3">
                        {/* Casual */}
                        <div className="flex items-start gap-3">
                          <span className="text-xs font-medium text-[var(--muted)] w-16 shrink-0 pt-0.5">
                            Casual:
                          </span>
                          <div className="flex-1">
                            <p className="text-[var(--foreground)]">
                              {phrase.casual}
                            </p>
                          </div>
                          <button
                            onClick={() => speak(phrase.casual)}
                            className="px-2 py-1 text-xs rounded bg-[var(--background)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--accent)] transition cursor-pointer"
                            title="Listen"
                          >
                            🔊
                          </button>
                        </div>

                        {/* Formal */}
                        <div className="flex items-start gap-3">
                          <span className="text-xs font-medium text-[var(--muted)] w-16 shrink-0 pt-0.5">
                            Formal:
                          </span>
                          <div className="flex-1">
                            <p className="text-[var(--foreground)]">
                              {phrase.formal}
                            </p>
                          </div>
                          <button
                            onClick={() => speak(phrase.formal)}
                            className="px-2 py-1 text-xs rounded bg-[var(--background)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--accent)] transition cursor-pointer"
                            title="Listen"
                          >
                            🔊
                          </button>
                        </div>

                        {/* Nuance */}
                        <div className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)]">
                          <p className="text-sm text-[var(--muted)]">
                            💡 {phrase.nuance}
                          </p>
                        </div>

                        {/* Action Button */}
                        <button
                          onClick={() => handleTryInRewrite(phrase.japanese)}
                          className="w-full px-4 py-2 bg-[var(--accent)]/10 text-[var(--accent)] font-medium rounded-lg hover:bg-[var(--accent)]/20 transition cursor-pointer text-sm"
                        >
                          Try in Rewrite →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Stats */}
        <div className="mt-8 text-center text-sm text-[var(--muted)]">
          {filteredPhrases.length} phrases
          {selectedCategory !== "all" &&
            ` in ${categories.find((c) => c.id === selectedCategory)?.name}`}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-[var(--muted)] text-sm border-t border-[var(--border)]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            <a
              href="/privacy"
              className="hover:text-[var(--accent)] transition"
            >
              Privacy
            </a>
            <a href="/terms" className="hover:text-[var(--accent)] transition">
              Terms
            </a>
            <span className="order-first sm:order-none">
              © 2026{" "}
              <a
                href="https://kyren.app"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--accent)] transition"
              >
                Kyren
              </a>
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
