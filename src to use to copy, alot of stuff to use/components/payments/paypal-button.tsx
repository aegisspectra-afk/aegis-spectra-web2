'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/cart-context';

interface PayPalButtonProps {
  onSuccess?: (orderId: string) => void;
  onError?: (error: string) => void;
  className?: string;
  // Provide a draft snapshot (including customer details) before redirecting to PayPal
  getDraft?: () => any;
}

export default function PayPalButton({ onSuccess, onError, className = '', getDraft }: PayPalButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { cart, getCartTotal } = useCart();

  const handlePayPalPayment = async () => {
    if (!cart || cart.length === 0) {
      onError?.('העגלה ריקה');
      return;
    }

    setIsLoading(true);

    try {
      // Persist checkout draft before redirect (used on return to build order)
      try {
        const draft = getDraft?.();
        if (draft) sessionStorage.setItem('aegis-checkout-draft', JSON.stringify(draft));
      } catch {}

      // Create PayPal order
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            name: item.name,
            unit_amount: item.price,
            quantity: item.quantity,
          })),
          totalAmount: getCartTotal ? getCartTotal() : 0,
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create PayPal order');
      }

      const { orderId, approvalUrl } = await response.json();

      if (approvalUrl) {
        // Redirect to PayPal for payment
        window.location.href = approvalUrl;
      } else {
        throw new Error('No approval URL received');
      }

    } catch (error) {
      console.error('PayPal payment error:', error);
      onError?.(error instanceof Error ? error.message : 'שגיאה בתשלום PayPal');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayPalPayment}
      disabled={isLoading || !cart || cart.length === 0}
      className={`
        w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 
        text-white font-semibold py-3 px-6 rounded-lg 
        transition-colors duration-200 flex items-center justify-center gap-2
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          מעבד תשלום...
        </>
      ) : (
        <>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.543-.68c-.013-.76-.4-1.43-1.003-1.928C18.456 3.822 16.847 3.2 14.458 3.2H7.46c-.524 0-.968.382-1.05.9L4.348 20.597h4.728l1.12-7.106c.082-.518.526-.9 1.05-.9h2.19c4.298 0 7.664-1.747 8.647-6.797.03-.149.054-.294.077-.437.292-1.867-.002-3.137-1.012-4.287z"/>
          </svg>
          תשלום עם PayPal
        </>
      )}
    </button>
  );
}