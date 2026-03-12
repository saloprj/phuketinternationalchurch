'use client';

import { useState } from 'react';

export default function AdminMediaPage() {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [error, setError] = useState('');

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    setUploadedUrl('');

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();

    if (data.url) {
      setUploadedUrl(data.url);
    } else {
      setError(data.error || 'Upload failed');
    }

    setUploading(false);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Media Upload</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-lg">
        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-2">Upload File</span>
          <p className="text-xs text-gray-500 mb-4">Images: max 10MB (JPEG, PNG, WebP). Audio: max 50MB (MP3, MP4, OGG). Documents: max 10MB (PDF).</p>
          <input
            type="file"
            accept="image/*,audio/*,.pdf"
            onChange={handleUpload}
            disabled={uploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#437086] file:text-white hover:file:bg-[#355a6d] disabled:opacity-50"
          />
        </label>

        {uploading && (
          <p className="mt-4 text-sm text-gray-500">Uploading...</p>
        )}

        {uploadedUrl && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-700 font-medium mb-1">Upload successful!</p>
            <code className="text-xs text-green-600 break-all">{uploadedUrl}</code>
            <button
              onClick={() => navigator.clipboard.writeText(uploadedUrl)}
              className="mt-2 block text-xs text-[#437086] hover:underline"
            >
              Copy URL
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
