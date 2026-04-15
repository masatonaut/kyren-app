import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    const priceId = process.env.STRIPE_PRICE_ID;
    if (!priceId) {
      console.error("STRIPE_PRICE_ID is not set");
      return NextResponse.json({ error: "Pricing not configured" }, { status: 500 });
    }

    const origin = request.headers.get("origin") || "https://phrasely.kyren.app";

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/?success=true&email=${encodeURIComponent(email)}`,
      cancel_url: `${origin}/?canceled=true`,
      metadata: { email },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
