"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

interface ReCaptchaProps {
  siteKey: string;
  onVerify: (token: string) => void;
  action?: string;
}

export function ReCaptcha({ siteKey, onVerify, action = "submit" }: ReCaptchaProps) {
  const isLoaded = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || isLoaded.current) return;

    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      isLoaded.current = true;
    };

    return () => {
      const existing = document.querySelector(`script[src*="recaptcha"]`);
      if (existing) {
        document.head.removeChild(existing);
      }
    };
  }, [siteKey]);

  const execute = async () => {
    if (typeof window === "undefined" || !window.grecaptcha || !isLoaded.current) {
      return null;
    }

    try {
      const token = await window.grecaptcha.execute(siteKey, { action });
      onVerify(token);
      return token;
    } catch (error) {
      console.error("reCAPTCHA error:", error);
      return null;
    }
  };

  return { execute };
}

// Hook for easy use
export function useReCaptcha(siteKey: string, action: string = "submit") {
  const execute = async () => {
    if (typeof window === "undefined" || !window.grecaptcha) {
      return null;
    }

    try {
      return await window.grecaptcha.execute(siteKey, { action });
    } catch (error) {
      console.error("reCAPTCHA error:", error);
      return null;
    }
  };

  return { execute };
}

