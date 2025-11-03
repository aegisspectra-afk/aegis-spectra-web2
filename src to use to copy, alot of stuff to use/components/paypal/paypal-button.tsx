'use client';

import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';

interface PayPalButtonProps {
  plan: 'BASIC' | 'PRO' | 'BUSINESS';
  onSuccess?: (subscriptionId: string) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
}

const planPrices = {
  BASIC: 29,
  PRO: 79,
  BUSINESS: 199,
};

const planDescriptions = {
  BASIC: 'Basic Plan - $29/month',
  PRO: 'Pro Plan - $79/month', 
  BUSINESS: 'Business Plan - $199/month',
};

export function PayPalButton({ plan, onSuccess, onError, disabled }: PayPalButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const createSubscription = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/paypal/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: plan,
          price: planPrices[plan],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create subscription');
      }

      const data = await response.json();
      return data.subscriptionId;
    } catch (error) {
      console.error('Error creating subscription:', error);
      onError?.(error instanceof Error ? error.message : 'Unknown error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const onApprove = async (data: any) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/paypal/approve-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: data.subscriptionID,
          plan: plan,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to approve subscription');
      }

      const result = await response.json();
      onSuccess?.(result.subscriptionId);
    } catch (error) {
      console.error('Error approving subscription:', error);
      onError?.(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayPalError = (error: any) => {
    console.error('PayPal error:', error);
    onError?.(error.message || 'Payment failed');
  };

  if (disabled || isLoading) {
    return (
      <Button disabled className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            {planDescriptions[plan]}
          </>
        )}
      </Button>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
        currency: 'USD',
        intent: 'subscription',
        vault: true,
      }}
    >
      <PayPalButtons
        createSubscription={createSubscription}
        onApprove={onApprove}
            onError={handlePayPalError}
        style={{
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'subscribe',
        }}
      />
    </PayPalScriptProvider>
  );
}