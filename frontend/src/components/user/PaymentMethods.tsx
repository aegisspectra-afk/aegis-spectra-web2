"use client";

import { useState, useEffect } from "react";
import { CreditCard, Plus, Trash2, CheckCircle } from "lucide-react";
import { useToastContext } from "@/components/ToastProvider";

interface PaymentMethod {
  id: string;
  type: "card" | "paypal";
  last4?: string;
  brand?: string;
  expiry_month?: number;
  expiry_year?: number;
  is_default: boolean;
  paypal_email?: string;
}

interface PaymentMethodsProps {
  userEmail?: string;
}

export function PaymentMethods({ userEmail }: PaymentMethodsProps) {
  const { showToast } = useToastContext();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (userEmail) {
      fetchMethods();
    }
  }, [userEmail]);

  const fetchMethods = async () => {
    try {
      const token = localStorage.getItem("user_token");
      const response = await fetch("/api/user/payment-methods", {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });
      const data = await response.json();
      if (data.ok && data.methods) {
        setMethods(data.methods);
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (methodId: string) => {
    if (!confirm("האם אתה בטוח שברצונך למחוק את שיטת התשלום?")) {
      return;
    }

    try {
      const token = localStorage.getItem("user_token");
      const response = await fetch(`/api/user/payment-methods/${methodId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });

      const data = await response.json();
      if (data.ok) {
        showToast("שיטת תשלום נמחקה בהצלחה", "success");
        fetchMethods();
      } else {
        showToast(data.error || "שגיאה במחיקת שיטת תשלום", "error");
      }
    } catch (error) {
      showToast("שגיאה במחיקת שיטת תשלום", "error");
    }
  };

  const handleSetDefault = async (methodId: string) => {
    try {
      const token = localStorage.getItem("user_token");
      const response = await fetch(`/api/user/payment-methods/${methodId}/set-default`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });

      const data = await response.json();
      if (data.ok) {
        showToast("שיטת תשלום הוגדרה כברירת מחדל", "success");
        fetchMethods();
      } else {
        showToast(data.error || "שגיאה בהגדרת שיטת תשלום", "error");
      }
    } catch (error) {
      showToast("שגיאה בהגדרת שיטת תשלום", "error");
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-black/30 p-8 backdrop-blur-sm">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-zinc-400">טוען שיטות תשלום...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-black/30 p-8 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CreditCard className="size-6 text-gold" />
          <h2 className="text-2xl font-bold text-white">שיטות תשלום</h2>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold text-black font-semibold hover:bg-gold/90 transition"
        >
          <Plus className="size-4" />
          הוסף שיטת תשלום
        </button>
      </div>

      {methods.length === 0 ? (
        <div className="text-center py-12">
          <CreditCard className="size-16 mx-auto mb-4 text-zinc-600" />
          <p className="text-zinc-400 mb-2">אין שיטות תשלום שמורות</p>
          <p className="text-sm text-zinc-500">הוסף שיטת תשלום כדי להאיץ את תהליך הרכישה</p>
        </div>
      ) : (
        <div className="space-y-3">
          {methods.map((method) => (
            <div
              key={method.id}
              className={`rounded-xl border p-4 ${
                method.is_default
                  ? "border-gold/50 bg-gold/5"
                  : "border-zinc-800 bg-black/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CreditCard className="size-8 text-zinc-400" />
                  <div>
                    {method.type === "card" ? (
                      <>
                        <div className="font-semibold text-white">
                          {method.brand} •••• {method.last4}
                        </div>
                        {method.expiry_month && method.expiry_year && (
                          <div className="text-sm text-zinc-400">
                            תפוגה: {method.expiry_month}/{method.expiry_year}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="font-semibold text-white">
                        PayPal: {method.paypal_email}
                      </div>
                    )}
                    {method.is_default && (
                      <div className="flex items-center gap-1 mt-1">
                        <CheckCircle className="size-3 text-gold" />
                        <span className="text-xs text-gold">ברירת מחדל</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {!method.is_default && (
                    <button
                      onClick={() => handleSetDefault(method.id)}
                      className="px-3 py-1.5 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition text-sm"
                    >
                      הגדר כברירת מחדל
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(method.id)}
                    className="p-2 rounded-lg border border-red-500/50 hover:bg-red-500/20 transition"
                    title="מחק"
                  >
                    <Trash2 className="size-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-charcoal border border-zinc-800 rounded-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-white mb-4">הוסף שיטת תשלום</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-zinc-800 bg-black/30">
                <p className="text-sm text-zinc-400 mb-4">
                  תכונת הוספת שיטות תשלום תשוחרר בקרוב. בינתיים, תוכל לשלם בכל הזמנה.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-full px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition"
              >
                סגור
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

