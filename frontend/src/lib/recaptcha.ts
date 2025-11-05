/**
 * reCAPTCHA v3 Server-side Verification
 * 
 * This utility verifies reCAPTCHA tokens on the server side.
 * Get your Secret Key from: https://www.google.com/recaptcha/admin
 */

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || "";

interface ReCaptchaVerifyResponse {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
}

/**
 * Verify reCAPTCHA v3 token on server side
 * @param token - The reCAPTCHA token from client
 * @param action - The action name (e.g., "lead_form", "register")
 * @param minScore - Minimum score to accept (default: 0.5)
 * @returns Promise<{valid: boolean, score?: number, error?: string}>
 */
export async function verifyRecaptcha(
  token: string | null,
  action: string = "submit",
  minScore: number = 0.5
): Promise<{ valid: boolean; score?: number; error?: string }> {
  // If no token provided, skip verification (for development)
  if (!token) {
    console.warn("No reCAPTCHA token provided, skipping verification");
    return { valid: true }; // Allow in dev, but should be false in production
  }

  // If no secret key configured, skip verification
  if (!RECAPTCHA_SECRET_KEY) {
    console.warn("RECAPTCHA_SECRET_KEY not configured, skipping verification");
    return { valid: true }; // Allow in dev, but should be false in production
  }

  try {
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: RECAPTCHA_SECRET_KEY,
          response: token,
        }),
      }
    );

    const data: ReCaptchaVerifyResponse = await response.json();

    if (!data.success) {
      const errors = data["error-codes"] || [];
      console.error("reCAPTCHA verification failed:", errors);
      return {
        valid: false,
        error: errors.join(", "),
      };
    }

    // Check action match
    if (data.action && data.action !== action) {
      console.warn(`reCAPTCHA action mismatch: expected ${action}, got ${data.action}`);
      // Still allow, but log warning
    }

    // Check score (reCAPTCHA v3 returns score 0.0-1.0)
    const score = data.score || 0;
    if (score < minScore) {
      console.warn(`reCAPTCHA score too low: ${score} (minimum: ${minScore})`);
      return {
        valid: false,
        score,
        error: `Score too low: ${score}`,
      };
    }

    return {
      valid: true,
      score,
    };
  } catch (error: any) {
    console.error("reCAPTCHA verification error:", error);
    return {
      valid: false,
      error: error.message || "Verification failed",
    };
  }
}

