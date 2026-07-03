'use client';

export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div className="fixed right-4 top-4 z-50 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white shadow-lg">
      {message}
    </div>
  );
}
