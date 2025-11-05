"use client";

import { useEffect, useRef, useState, useCallback } from "react";

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

// Initialize reCAPTCHA script (call once)
let recaptchaLoaded = false;
let recaptchaLoading = false;

const loadReCaptcha = (siteKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Window not available"));
      return;
    }

    if (recaptchaLoaded && window.grecaptcha) {
      resolve();
      return;
    }

    if (recaptchaLoading) {
      // Wait for existing load
      const checkInterval = setInterval(() => {
        if (recaptchaLoaded && window.grecaptcha) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
      return;
    }

    recaptchaLoading = true;
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.grecaptcha.ready(() => {
        recaptchaLoaded = true;
        recaptchaLoading = false;
        resolve();
      });
    };

    script.onerror = () => {
      recaptchaLoading = false;
      reject(new Error("Failed to load reCAPTCHA"));
    };
  });
};

// Hook for easy use
export function useReCaptcha(action: string = "submit") {
  const [isReady, setIsReady] = useState(false);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

  useEffect(() => {
    if (!siteKey || typeof window === "undefined") return;

    loadReCaptcha(siteKey)
      .then(() => setIsReady(true))
      .catch((err) => console.error("reCAPTCHA load error:", err));
  }, [siteKey]);

  const execute = useCallback(async (): Promise<string | null> => {
    if (!siteKey || typeof window === "undefined" || !window.grecaptcha || !isReady) {
      console.warn("reCAPTCHA not ready");
      return null;
    }

    try {
      const token = await window.grecaptcha.execute(siteKey, { action });
      return token;
    } catch (error) {
      console.error("reCAPTCHA execute error:", error);
      return null;
    }
  }, [siteKey, action, isReady]);

  return { execute, isReady };
}

