"use client";

import { useState, useMemo } from "react";
import { Package, Download, Search, Filter, Calendar, CheckCircle, Clock, XCircle, FileText } from "lucide-react";
import Link from "next/link";

interface Order {
  id: number;
  product_sku: string;
  status: string;
  created_at: string;
  total: number;
  order_id?: string;
  items?: any[];
}

interface OrdersListProps {
  orders: Order[];
}

export function OrdersList({ orders }: OrdersListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = 
        order.product_sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.order_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items?.some(item => item.name?.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      
      const matchesDate = (() => {
        if (dateFilter === "all") return true;
        const orderDate = new Date(order.created_at);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (dateFilter === "today") return daysDiff === 0;
        if (dateFilter === "week") return daysDiff <= 7;
        if (dateFilter === "month") return daysDiff <= 30;
        if (dateFilter === "year") return daysDiff <= 365;
        return true;
      })();
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const handleDownloadInvoice = async (order: Order) => {
    try {
      // TODO: Implement PDF generation
      const response = await fetch(`/api/orders/${order.order_id || order.id}/invoice`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("user_token")}`,
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `invoice-${order.order_id || order.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert("שגיאה בהורדת החשבונית");
      }
    } catch (error) {
      console.error("Error downloading invoice:", error);
      alert("שגיאה בהורדת החשבונית");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="size-4 text-green-400" />;
      case "pending":
        return <Clock className="size-4 text-yellow-400" />;
      case "processing":
        return <Clock className="size-4 text-blue-400" />;
      case "cancelled":
        return <XCircle className="size-4 text-red-400" />;
      default:
        return <Clock className="size-4 text-zinc-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "הושלם";
      case "pending":
        return "ממתין";
      case "processing":
        return "בטיפול";
      case "cancelled":
        return "בוטל";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 size-5 text-zinc-400" />
          <input
            type="text"
            placeholder="חפש הזמנות..."
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
          <option value="pending">ממתין</option>
          <option value="processing">בטיפול</option>
          <option value="completed">הושלם</option>
          <option value="cancelled">בוטל</option>
        </select>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold/70"
        >
          <option value="all">כל התאריכים</option>
          <option value="today">היום</option>
          <option value="week">השבוע האחרון</option>
          <option value="month">החודש האחרון</option>
          <option value="year">השנה האחרונה</option>
        </select>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="size-12 mx-auto mb-4 text-zinc-400" />
          <p className="text-zinc-400 mb-4">
            {orders.length === 0 ? "אין הזמנות עדיין" : "לא נמצאו הזמנות התואמות לחיפוש"}
          </p>
          {orders.length === 0 && (
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 rounded-xl bg-gold text-black px-6 py-3 font-semibold hover:bg-gold/90 transition"
            >
              הזמינו ייעוץ חינם
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-zinc-800 bg-black/30 p-6 hover:border-zinc-600 transition"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="font-semibold text-white">
                      הזמנה #{order.order_id || order.id}
                    </div>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(order.status)}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === "completed"
                            ? "bg-green-500/20 text-green-400"
                            : order.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : order.status === "processing"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                  </div>
                  {order.items && order.items.length > 0 && (
                    <div className="text-sm text-zinc-400 mb-2">
                      {order.items.length} פריט{order.items.length > 1 ? "ים" : ""}
                    </div>
                  )}
                  <div className="text-sm text-zinc-400">
                    {new Date(order.created_at).toLocaleDateString("he-IL", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-bold text-gold mb-1 text-xl">{order.total} ₪</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownloadInvoice(order)}
                      className="p-2 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition"
                      title="הורד חשבונית"
                    >
                      <Download className="size-4 text-zinc-400" />
                    </button>
                    <Link
                      href={`/order/${order.order_id || order.id}`}
                      className="p-2 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition"
                      title="צפה בפרטים"
                    >
                      <FileText className="size-4 text-zinc-400" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

