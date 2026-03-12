import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { amount, isRecurring, donorName, donorEmail } = await req.json();

  if (!amount || amount < 20) {
    return NextResponse.json({ error: 'Minimum donation is 20 THB' }, { status: 400 });
  }

  // Convert THB to satangs (×100)
  const amountSatangs = Math.round(amount * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountSatangs,
    currency: 'thb',
    metadata: {
      donorName: donorName || '',
      donorEmail: donorEmail || '',
      isRecurring: String(isRecurring || false),
    },
  });

  await prisma.donation.create({
    data: {
      amount: amountSatangs,
      currency: 'THB',
      method: 'STRIPE_CARD',
      isRecurring: isRecurring || false,
      status: 'PENDING',
      stripePaymentId: paymentIntent.id,
      donorName: donorName || null,
      donorEmail: donorEmail || null,
    },
  });

  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}
