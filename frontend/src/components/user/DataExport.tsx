"use client";

import { useState } from "react";
import { Download, FileText, Database, CheckCircle } from "lucide-react";
import { useToastContext } from "@/components/ToastProvider";

interface DataExportProps {
  userEmail?: string;
}

export function DataExport({ userEmail }: DataExportProps) {
  const { showToast } = useToastContext();
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExport = async (type: "all" | "orders" | "profile" | "activity") => {
    setExporting(type);
    try {
      const token = localStorage.getItem("user_token");
      const response = await fetch(`/api/user/export?type=${type}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });

      const data = await response.json();
      if (data.ok && data.download_url) {
        // Download file
        const a = document.createElement("a");
        a.href = data.download_url;
        a.download = `export-${type}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast("נתונים יוצאו בהצלחה", "success");
      } else {
        showToast(data.error || "שגיאה בייצוא נתונים", "error");
      }
    } catch (error) {
      showToast("שגיאה בייצוא נתונים", "error");
    } finally {
      setExporting(null);
    }
  };

  const exportOptions = [
    {
      id: "all" as const,
      label: "כל הנתונים",
      description: "ייצוא מלא של כל הנתונים האישיים (GDPR)",
      icon: Database,
    },
    {
      id: "orders" as const,
      label: "הזמנות",
      description: "היסטוריית כל ההזמנות",
      icon: FileText,
    },
    {
      id: "profile" as const,
      label: "פרופיל",
      description: "נתוני פרופיל והגדרות",
      icon: CheckCircle,
    },
    {
      id: "activity" as const,
      label: "פעילות",
      description: "לוג כל הפעולות והכניסות",
      icon: Download,
    },
  ];

  return (
    <div className="rounded-2xl border border-zinc-800 bg-black/30 p-8 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <Download className="size-6 text-gold" />
        <h2 className="text-2xl font-bold text-white">ייצוא נתונים</h2>
      </div>

      <div className="mb-6 p-4 rounded-lg border border-blue-500/30 bg-blue-500/10">
        <div className="text-sm text-blue-400">
          <strong>זכותך לייצא את הנתונים שלך (GDPR)</strong>
          <br />
          אתה יכול לייצא את כל הנתונים האישיים שלך בכל עת. הנתונים יוצאו בפורמט JSON.
        </div>
      </div>

      <div className="space-y-3">
        {exportOptions.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.id}
              onClick={() => handleExport(option.id)}
              disabled={exporting !== null}
              className="w-full text-right p-4 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className="size-5 text-zinc-400" />
                  <div>
                    <div className="font-semibold text-white">{option.label}</div>
                    <div className="text-sm text-zinc-400">{option.description}</div>
                  </div>
                </div>
                {exporting === option.id ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gold"></div>
                ) : (
                  <Download className="size-5 text-zinc-400" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

