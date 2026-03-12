import { NextRequest, NextResponse } from 'next/server';
import generatePayload from 'promptpay-qr';
import QRCode from 'qrcode';

// Church PromptPay ID (mobile number)
const PROMPTPAY_ID = '0634546790';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const amount = parseFloat(searchParams.get('amount') || '0');

  if (amount <= 0 || amount > 1000000) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
  }

  const payload = generatePayload(PROMPTPAY_ID, { amount });
  const qrBuffer = await QRCode.toBuffer(payload, {
    type: 'png',
    width: 300,
    margin: 2,
    color: { dark: '#437086', light: '#FFFFFF' },
  });

  return new NextResponse(qrBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'no-cache',
    },
  });
}
