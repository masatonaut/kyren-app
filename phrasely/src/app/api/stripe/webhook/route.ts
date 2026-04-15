import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSupabase } from "@/lib/supabase";
import type Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = getSupabase();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const email = session.customer_email || session.metadata?.email;
      if (!email) break;

      // Get subscription period end
      let periodEnd: string | null = null;
      if (session.subscription) {
        const sub = await stripe.subscriptions.retrieve(
          session.subscription as string
        );
        const endTs = (sub as unknown as { current_period_end: number }).current_period_end;
        if (endTs) {
          periodEnd = new Date(endTs * 1000).toISOString();
        }
      }

      await supabase.from("subscribers").upsert(
        {
          email,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          status: "active",
          plan: "pro",
          current_period_end: periodEnd,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "email" }
      );
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const endTs = (subscription as unknown as { current_period_end: number }).current_period_end;
      await supabase
        .from("subscribers")
        .update({
          status: subscription.status === "active" ? "active" : subscription.status,
          current_period_end: endTs ? new Date(endTs * 1000).toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_subscription_id", subscription.id);
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await supabase
        .from("subscribers")
        .update({
          status: "canceled",
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_subscription_id", subscription.id);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
