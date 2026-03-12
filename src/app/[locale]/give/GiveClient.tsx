'use client';

import { useState } from 'react';
import Image from 'next/image';

const PRESET_AMOUNTS = [300, 500, 1000, 2000];

export default function GiveClient() {
  const [isMonthly, setIsMonthly] = useState(false);
  const [amount, setAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState('');
  const [activePreset, setActivePreset] = useState(500);

  const displayAmount = customAmount ? parseInt(customAmount) || 0 : activePreset;

  function selectPreset(value: number) {
    setActivePreset(value);
    setAmount(value);
    setCustomAmount('');
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* One-time / Monthly toggle */}
      <div className="flex border-b border-gray-100">
        <button
          type="button"
          onClick={() => setIsMonthly(false)}
          className={`flex-1 py-4 text-sm font-semibold transition-colors ${
            !isMonthly
              ? 'bg-primary text-white'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          One-time Gift
        </button>
        <button
          type="button"
          onClick={() => setIsMonthly(true)}
          className={`flex-1 py-4 text-sm font-semibold transition-colors ${
            isMonthly
              ? 'bg-primary text-white'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          Monthly Gift
        </button>
      </div>

      <div className="p-6 sm:p-8">
        {/* Amount selector */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-text-main mb-3">
            Select Amount (THB)
          </p>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {PRESET_AMOUNTS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => selectPreset(preset)}
                className={`py-2.5 rounded-lg text-sm font-semibold border-2 transition-colors ${
                  activePreset === preset && !customAmount
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-200 text-text-main hover:border-primary/50'
                }`}
              >
                ฿{preset.toLocaleString()}
              </button>
            ))}
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
              ฿
            </span>
            <input
              type="number"
              min="1"
              placeholder="Other amount"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setActivePreset(-1);
              }}
              className="w-full pl-8 pr-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Card Payment */}
          <div>
            <h2 className="text-base font-bold text-text-main mb-4">
              Pay with Card
            </h2>
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 mb-4">
              <p className="text-xs text-gray-500 mb-4">
                Secure payment powered by Stripe
              </p>
              {/* Placeholder for Stripe Elements */}
              <div className="bg-white border border-dashed border-gray-300 rounded-lg h-10 mb-3 flex items-center justify-center text-xs text-gray-400">
                Card number field
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white border border-dashed border-gray-300 rounded-lg h-10 flex items-center justify-center text-xs text-gray-400">
                  Expiry
                </div>
                <div className="bg-white border border-dashed border-gray-300 rounded-lg h-10 flex items-center justify-center text-xs text-gray-400">
                  CVC
                </div>
              </div>
            </div>
            <a
              href={`/api/donate/checkout?amount=${displayAmount}&recurring=${isMonthly}`}
              className="w-full block text-center bg-primary text-white py-3 rounded-lg font-bold text-sm hover:bg-primary-dark transition-colors"
            >
              Pay ฿{displayAmount.toLocaleString()} with Card
            </a>
          </div>

          {/* PromptPay QR */}
          <div>
            <h2 className="text-base font-bold text-text-main mb-4">
              PromptPay QR
            </h2>
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 text-center">
              <p className="text-xs text-gray-500 mb-3">
                Scan with any Thai banking app
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/donate/promptpay?amount=${displayAmount}`}
                alt={`PromptPay QR code for ฿${displayAmount}`}
                width={200}
                height={200}
                className="mx-auto rounded-lg"
              />
              <p className="text-xs text-gray-400 mt-3">
                Amount: ฿{displayAmount.toLocaleString()}
                {isMonthly && ' / month'}
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center mt-6">
          All transactions are secure and encrypted. Phuket International Church
          is a registered foundation in Thailand.
        </p>
      </div>
    </div>
  );
}
