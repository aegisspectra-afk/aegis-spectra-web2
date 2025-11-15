"use client";

import { useState, useEffect } from "react";
import { FileText, Download, Calendar, Search, Filter } from "lucide-react";

interface Invoice {
  id: string;
  order_id: string;
  invoice_number: string;
  total: number;
  status: "paid" | "pending" | "overdue";
  created_at: string;
  due_date?: string;
}

interface InvoicesListProps {
  userEmail?: string;
}

export function InvoicesList({ userEmail }: InvoicesListProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    if (userEmail) {
      fetchInvoices();
    }
  }, [userEmail, statusFilter]);

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem("user_token");
      const response = await fetch(
        `/api/user/invoices?user_email=${encodeURIComponent(userEmail || "")}&status=${statusFilter}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        }
      );
      const data = await response.json();
      if (data.ok && data.invoices) {
        setInvoices(data.invoices);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (invoice: Invoice) => {
    try {
      const token = localStorage.getItem("user_token");
      const response = await fetch(`/api/user/invoices/${invoice.id}/download`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `invoice-${invoice.invoice_number}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Error downloading invoice:", error);
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.order_id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-black/30 p-8 backdrop-blur-sm">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-zinc-400">טוען חשבוניות...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-black/30 p-8 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="size-6 text-gold" />
          <h2 className="text-2xl font-bold text-white">חשבוניות ומסמכים</h2>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 size-5 text-zinc-400" />
          <input
            type="text"
            placeholder="חפש חשבוניות..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 pr-10 text-white focus:outline-none focus:border-gold/70"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold/70"
        >
          <option value="all">כל הסטטוסים</option>
          <option value="paid">שולם</option>
          <option value="pending">ממתין</option>
          <option value="overdue">איחור</option>
        </select>
      </div>

      {filteredInvoices.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="size-16 mx-auto mb-4 text-zinc-600" />
          <p className="text-zinc-400 mb-2">אין חשבוניות להצגה</p>
          <p className="text-sm text-zinc-500">כל החשבוניות יופיעו כאן</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredInvoices.map((invoice) => (
            <div
              key={invoice.id}
              className="rounded-xl border border-zinc-800 bg-black/20 p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="size-5 text-zinc-400" />
                    <div>
                      <div className="font-semibold text-white">
                        חשבונית #{invoice.invoice_number}
                      </div>
                      <div className="text-sm text-zinc-400">
                        הזמנה #{invoice.order_id}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-zinc-400">
                    <span>
                      {new Date(invoice.created_at).toLocaleDateString("he-IL")}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      invoice.status === "paid"
                        ? "bg-green-500/20 text-green-400"
                        : invoice.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                    }`}>
                      {invoice.status === "paid" ? "שולם" :
                       invoice.status === "pending" ? "ממתין" : "איחור"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-bold text-gold text-xl">{invoice.total} ₪</div>
                  </div>
                  <button
                    onClick={() => handleDownload(invoice)}
                    className="p-2 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition"
                    title="הורד PDF"
                  >
                    <Download className="size-5 text-zinc-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

