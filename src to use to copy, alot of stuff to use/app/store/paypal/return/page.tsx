'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PayPalReturnPage() {
  const sp = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = sp.get('token');
    if (!token) {
      setError('Missing token');
      return;
    }
    (async () => {
      try {
        const res = await fetch('/api/paypal/capture-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        if (!res.ok) throw new Error('capture-failed');
        const { orderId } = await res.json();
        // Build order from draft
        try {
          const draftRaw = sessionStorage.getItem('aegis-checkout-draft');
          if (draftRaw) {
            const draft = JSON.parse(draftRaw);
            const fullOrder = {
              id: orderId,
              createdAt: new Date().toISOString(),
              ...draft,
            };
            sessionStorage.setItem('aegis-last-order', JSON.stringify(fullOrder));
          }
        } catch {}
        window.location.href = '/store/checkout/success';
      } catch (e) {
        setError('שגיאה באישור התשלום');
      }
    })();
  }, [sp]);

  return (
    <div className="min-h-screen grid place-items-center">
      <div className="text-center">
        <div className="text-xl">מעבד תשלום…</div>
        {error ? <div className="text-red-500 mt-2">{error}</div> : null}
      </div>
    </div>
  );
}


