'use client';

import { useState } from 'react';

export function useToast() {
  const [message, setMessage] = useState('');

  function showToast(text) {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  }

  return { message, showToast };
}
