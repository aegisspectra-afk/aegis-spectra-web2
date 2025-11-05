"use client";

import { useState } from "react";
import { ReviewStars } from "./ReviewStars";
import { Send, X } from "lucide-react";
import { useToastContext } from "@/components/ToastProvider";

interface ReviewFormProps {
  productId?: number;
  sku?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ReviewForm({ productId, sku, onSuccess, onCancel }: ReviewFormProps) {
  const { showToast } = useToastContext();
  const [rating, setRating] = useState(0);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [title, setTitle] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating || rating < 1 || rating > 5) {
      showToast("אנא בחר דירוג", "error");
      return;
    }

    if (!userName.trim()) {
      showToast("אנא הזן שם", "error");
      return;
    }

    if (!reviewText.trim()) {
      showToast("אנא הזן ביקורה", "error");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          sku: sku,
          user_name: userName.trim(),
          user_email: userEmail.trim() || undefined,
          rating: rating,
          title: title.trim() || undefined,
          review_text: reviewText.trim(),
        }),
      });

      const data = await res.json();

      if (data.ok) {
        showToast("ביקורתך התקבלה בהצלחה! תודה על המשוב.", "success");
        // Reset form
        setRating(0);
        setUserName("");
        setUserEmail("");
        setTitle("");
        setReviewText("");
        if (onSuccess) onSuccess();
      } else {
        showToast(data.error || "שגיאה בשליחת ביקורה", "error");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      showToast("שגיאה בשליחת ביקורה", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-6 border border-gray-700 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white">כתוב ביקורה</h3>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          דירוג <span className="text-red-400">*</span>
        </label>
        <ReviewStars
          rating={rating}
          interactive={true}
          onRatingChange={setRating}
          size={28}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          שם <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          placeholder="הזן את שמך"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          אימייל (אופציונלי)
        </label>
        <input
          type="email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          placeholder="example@email.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          כותרת (אופציונלי)
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          placeholder="כותרת קצרה לביקורה"
          maxLength={255}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          ביקורה <span className="text-red-400">*</span>
        </label>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          required
          rows={6}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
          placeholder="שתף את חווייתך עם המוצר..."
          maxLength={2000}
        />
        <p className="text-xs text-gray-400 mt-1 text-left">
          {reviewText.length}/2000 תווים
        </p>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting || !rating || !userName.trim() || !reviewText.trim()}
          className="flex-1 flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {submitting ? (
            "שולח..."
          ) : (
            <>
              <Send size={18} />
              שלח ביקורה
            </>
          )}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            ביטול
          </button>
        )}
      </div>
    </form>
  );
}

