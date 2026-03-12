import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return NextResponse.json({ error: `Webhook error: ${(err as Error).message}` }, { status: 400 });
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    await prisma.donation.updateMany({
      where: { stripePaymentId: paymentIntent.id },
      data: { status: 'COMPLETED' },
    });
  } else if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object;
    await prisma.donation.updateMany({
      where: { stripePaymentId: paymentIntent.id },
      data: { status: 'FAILED' },
    });
  }

  return NextResponse.json({ received: true });
}
