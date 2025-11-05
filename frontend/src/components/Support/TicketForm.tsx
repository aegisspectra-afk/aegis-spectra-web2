"use client";

import { useState } from "react";
import { Send, X } from "lucide-react";
import { useToastContext } from "@/components/ToastProvider";

interface TicketFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  orderId?: number;
  productId?: number;
}

export function TicketForm({ onSuccess, onCancel, orderId, productId }: TicketFormProps) {
  const { showToast } = useToastContext();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    subject: "",
    message: "",
    category: "general",
    priority: "medium",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.user_name.trim()) {
      showToast("אנא הזן שם", "error");
      return;
    }

    if (!formData.user_email.trim()) {
      showToast("אנא הזן אימייל", "error");
      return;
    }

    if (!formData.subject.trim()) {
      showToast("אנא הזן נושא", "error");
      return;
    }

    if (!formData.message.trim()) {
      showToast("אנא הזן הודעה", "error");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          order_id: orderId || undefined,
          product_id: productId || undefined,
        }),
      });

      const data = await res.json();

      if (data.ok) {
        showToast("כרטיס תמיכה נוצר בהצלחה! מספר כרטיס: " + data.ticket.ticket_number, "success");
        // Reset form
        setFormData({
          user_name: "",
          user_email: "",
          subject: "",
          message: "",
          category: "general",
          priority: "medium",
        });
        if (onSuccess) onSuccess();
      } else {
        showToast(data.error || "שגיאה ביצירת כרטיס תמיכה", "error");
      }
    } catch (err) {
      console.error("Error submitting ticket:", err);
      showToast("שגיאה ביצירת כרטיס תמיכה", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-6 border border-gray-700 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white">צור כרטיס תמיכה</h3>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            שם <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.user_name}
            onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
            required
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="הזן את שמך"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            אימייל <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            value={formData.user_email}
            onChange={(e) => setFormData({ ...formData, user_email: e.target.value })}
            required
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="example@email.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          נושא <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          required
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          placeholder="סיכום קצר של הבעיה"
          maxLength={255}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            קטגוריה
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="general">כללי</option>
            <option value="technical">טכני</option>
            <option value="billing">חיוב</option>
            <option value="order">הזמנה</option>
            <option value="product">מוצר</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            עדיפות
          </label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="low">נמוכה</option>
            <option value="medium">בינונית</option>
            <option value="high">גבוהה</option>
            <option value="urgent">דחוף</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          הודעה <span className="text-red-400">*</span>
        </label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
          rows={6}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
          placeholder="תאר את הבעיה בפירוט..."
          maxLength={2000}
        />
        <p className="text-xs text-gray-400 mt-1 text-left">
          {formData.message.length}/2000 תווים
        </p>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting || !formData.user_name.trim() || !formData.user_email.trim() || !formData.subject.trim() || !formData.message.trim()}
          className="flex-1 flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {submitting ? (
            "שולח..."
          ) : (
            <>
              <Send size={18} />
              שלח כרטיס תמיכה
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

