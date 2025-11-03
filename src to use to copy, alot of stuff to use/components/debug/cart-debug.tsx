'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/contexts/cart-context';

export function CartDebug() {
  const [localStorageCart, setLocalStorageCart] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  const { cart, getCartItemCount, getCartTotal } = useCart();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const savedCart = localStorage.getItem('aegis-cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          setLocalStorageCart(JSON.stringify(parsedCart, null, 2));
        } catch (error) {
          setLocalStorageCart(`Error parsing cart: ${savedCart}`);
        }
      } else {
        setLocalStorageCart('No cart found');
      }
    }
  }, [isClient]);

  if (!isClient) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black text-white p-4 rounded-lg text-xs max-w-md z-50">
      <h3 className="font-bold mb-2">Cart Debug:</h3>
      
      <div className="mb-2">
        <strong>Current Cart State:</strong>
        <div className="text-green-400">
          Items: {getCartItemCount()} | Total: ₪{getCartTotal()}
        </div>
      </div>
      
      <div className="mb-2">
        <strong>localStorage:</strong>
        <pre className="whitespace-pre-wrap break-words text-xs">
          {localStorageCart}
        </pre>
      </div>
      <button 
        onClick={() => {
          const savedCart = localStorage.getItem('aegis-cart');
          if (savedCart) {
            try {
              const parsedCart = JSON.parse(savedCart);
              setLocalStorageCart(JSON.stringify(parsedCart, null, 2));
            } catch (error) {
              setLocalStorageCart(`Error parsing cart: ${savedCart}`);
            }
          } else {
            setLocalStorageCart('No cart found');
          }
        }}
        className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
      >
        Refresh
      </button>
    </div>
  );
}
