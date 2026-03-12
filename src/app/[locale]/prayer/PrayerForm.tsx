'use client';

import { useState } from 'react';

interface PrayerFormProps {
  locale: string;
}

export default function PrayerForm({ locale }: PrayerFormProps) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    request: '',
    isPublic: false,
    consent: false,
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.consent) {
      setErrorMsg('Please confirm your consent to continue.');
      setStatus('error');
      return;
    }
    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/prayer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email || undefined,
          request: form.request,
          isPublic: form.isPublic,
          locale,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
        <svg
          className="w-14 h-14 text-green-500 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="text-xl font-bold text-green-800 mb-2">
          Prayer request received!
        </h2>
        <p className="text-green-700">
          Thank you for trusting us with your prayer request. We are praying for
          you, {form.name}.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-5"
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="prayer-name"
            className="block text-sm font-medium text-text-main mb-1"
          >
            Your Name <span className="text-red-500">*</span>
          </label>
          <input
            id="prayer-name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </div>
        <div>
          <label
            htmlFor="prayer-email"
            className="block text-sm font-medium text-text-main mb-1"
          >
            Email{' '}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            id="prayer-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="prayer-request"
          className="block text-sm font-medium text-text-main mb-1"
        >
          Your Prayer Request <span className="text-red-500">*</span>
        </label>
        <textarea
          id="prayer-request"
          name="request"
          rows={6}
          required
          value={form.request}
          onChange={handleChange}
          placeholder="Share what is on your heart..."
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
        />
      </div>

      <div className="flex items-start gap-3">
        <input
          id="isPublic"
          name="isPublic"
          type="checkbox"
          checked={form.isPublic}
          onChange={handleChange}
          className="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label htmlFor="isPublic" className="text-sm text-gray-600">
          Share this request publicly in our community prayer list (anonymously
          if you prefer)
        </label>
      </div>

      <div className="flex items-start gap-3">
        <input
          id="prayer-consent"
          name="consent"
          type="checkbox"
          checked={form.consent}
          onChange={handleChange}
          className="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label htmlFor="prayer-consent" className="text-sm text-gray-600">
          I consent to Phuket International Church receiving and praying over
          this request. My information will be kept confidential.{' '}
          <span className="text-red-500">*</span>
        </label>
      </div>

      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'submitting' ? 'Submitting…' : 'Submit Prayer Request'}
      </button>
    </form>
  );
}
