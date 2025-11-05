"use client";

import { useState } from "react";
import { MessageSquare, HelpCircle, Search, Ticket } from "lucide-react";
import { FAQList } from "@/components/Support/FAQList";
import { TicketForm } from "@/components/Support/TicketForm";

export default function SupportPage() {
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const categories = [
    { value: "", label: "הכל" },
    { value: "general", label: "כללי" },
    { value: "technical", label: "טכני" },
    { value: "billing", label: "חיוב" },
    { value: "order", label: "הזמנה" },
    { value: "product", label: "מוצר" },
  ];

  return (
    <main className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(212,175,55,0.12),transparent),linear-gradient(#0B0B0D,#141418)]" />
      
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageSquare className="text-gold size-10" />
            <h1 className="text-4xl font-extrabold">שירות לקוחות</h1>
          </div>
          <p className="text-xl text-gray-300">
            אנחנו כאן לעזור! חפש תשובות או צור כרטיס תמיכה
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="חפש שאלות נפוצות..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowTicketForm(!showTicketForm)}
              className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              <Ticket size={18} />
              {showTicketForm ? "סגור טופס" : "צור כרטיס תמיכה"}
            </button>
          </div>
        </div>

        {/* Ticket Form */}
        {showTicketForm && (
          <div className="mb-8">
            <TicketForm
              onSuccess={() => {
                setShowTicketForm(false);
              }}
              onCancel={() => setShowTicketForm(false)}
            />
          </div>
        )}

        {/* FAQ Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="text-gold" />
            <h2 className="text-2xl font-bold">שאלות נפוצות (FAQ)</h2>
          </div>
          <FAQList category={selectedCategory || undefined} searchQuery={searchQuery || undefined} />
        </div>

        {/* Contact Info */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-bold mb-4">דרכים נוספות ליצירת קשר</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold text-gold mb-2">אימייל</h4>
              <a href="mailto:Aegisspectra@gmail.com" className="text-gray-300 hover:text-white transition-colors">
                Aegisspectra@gmail.com
              </a>
            </div>
            <div>
              <h4 className="font-semibold text-gold mb-2">טלפון</h4>
              <a href="tel:+972559737025" className="text-gray-300 hover:text-white transition-colors">
                055-973-7025
              </a>
            </div>
            <div>
              <h4 className="font-semibold text-gold mb-2">WhatsApp</h4>
              <a
                href="https://wa.me/972559737025"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                פתח שיחה ב-WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

