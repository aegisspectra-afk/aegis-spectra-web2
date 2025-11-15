"use client";

import { useState } from "react";
import { Download, FileText, BarChart3, Calendar, Filter } from "lucide-react";
import { useToastContext } from "@/components/ToastProvider";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

interface AdvancedReportsProps {
  userEmail?: string;
}

export function AdvancedReports({ userEmail }: AdvancedReportsProps) {
  const { showToast } = useToastContext();
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState<"orders" | "loyalty" | "activity">("orders");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });

  const generatePDF = async (data: any[], title: string) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(title, 14, 20);
    doc.setFontSize(12);
    doc.text(`תאריך יצירה: ${new Date().toLocaleDateString("he-IL")}`, 14, 30);
    doc.text(`טווח תאריכים: ${new Date(dateRange.start).toLocaleDateString("he-IL")} - ${new Date(dateRange.end).toLocaleDateString("he-IL")}`, 14, 36);

    let y = 50;
    data.forEach((item, index) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(10);
      doc.text(`${index + 1}. ${JSON.stringify(item, null, 2)}`, 14, y);
      y += 15;
    });

    doc.save(`${title}_${new Date().toISOString().split("T")[0]}.pdf`);
    showToast("דוח PDF נוצר בהצלחה", "success");
  };

  const generateExcel = async (data: any[], title: string) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "דוח");
    XLSX.writeFile(wb, `${title}_${new Date().toISOString().split("T")[0]}.xlsx`);
    showToast("דוח Excel נוצר בהצלחה", "success");
  };

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("user_token");
      let endpoint = "";
      let title = "";

      switch (reportType) {
        case "orders":
          endpoint = `/api/user/orders?start_date=${dateRange.start}&end_date=${dateRange.end}`;
          title = "דוח הזמנות";
          break;
        case "loyalty":
          endpoint = `/api/loyalty/transactions?user_email=${encodeURIComponent(userEmail || "")}&start_date=${dateRange.start}&end_date=${dateRange.end}`;
          title = "דוח נאמנות";
          break;
        case "activity":
          endpoint = `/api/user/activity?user_email=${encodeURIComponent(userEmail || "")}&start_date=${dateRange.start}&end_date=${dateRange.end}`;
          title = "דוח פעילות";
          break;
      }

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.ok) {
        return { data: data.orders || data.transactions || data.activities || [], title };
      } else {
        showToast(data.error || "שגיאה בטעינת נתונים", "error");
        return null;
      }
    } catch (error) {
      showToast("שגיאה בטעינת נתונים", "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: "pdf" | "excel") => {
    const result = await fetchReportData();
    if (!result || result.data.length === 0) {
      showToast("אין נתונים לייצוא", "info");
      return;
    }

    if (format === "pdf") {
      generatePDF(result.data, result.title);
    } else {
      generateExcel(result.data, result.title);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-black/30 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="size-5 text-gold" />
          דוחות מתקדמים
        </h3>
      </div>

      <div className="space-y-6">
        {/* Report Type Selection */}
        <div>
          <label className="block text-sm font-medium mb-2 text-zinc-300">סוג דוח</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "orders" as const, label: "הזמנות", icon: FileText },
              { value: "loyalty" as const, label: "נאמנות", icon: BarChart3 },
              { value: "activity" as const, label: "פעילות", icon: Calendar },
            ].map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.value}
                  onClick={() => setReportType(type.value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition ${
                    reportType === type.value
                      ? "border-gold bg-gold/10"
                      : "border-zinc-700 hover:border-zinc-600"
                  }`}
                >
                  <Icon className="size-6 text-zinc-400" />
                  <span className="text-sm text-zinc-300">{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-zinc-300">תאריך התחלה</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold/70"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-zinc-300">תאריך סיום</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold/70"
            />
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => handleExport("pdf")}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 transition disabled:opacity-50"
          >
            <Download className="size-5" />
            ייצא PDF
          </button>
          <button
            onClick={() => handleExport("excel")}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-green-500/20 border border-green-500/50 text-green-400 hover:bg-green-500/30 transition disabled:opacity-50"
          >
            <Download className="size-5" />
            ייצא Excel
          </button>
        </div>
      </div>
    </div>
  );
}

