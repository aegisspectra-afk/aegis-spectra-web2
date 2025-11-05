"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, ThumbsUp, ThumbsDown } from "lucide-react";

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string | null;
  views: number;
  helpful_count: number;
  tags: string[] | null;
}

interface FAQListProps {
  category?: string;
  searchQuery?: string;
  limit?: number;
}

export function FAQList({ category, searchQuery, limit = 20 }: FAQListProps) {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<number | null>(null);
  const [helpfulVotes, setHelpfulVotes] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchFAQs();
  }, [category, searchQuery]);

  const fetchFAQs = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (category) params.append("category", category);
      if (searchQuery) params.append("search", searchQuery);
      if (limit) params.append("limit", limit.toString());

      const res = await fetch(`/api/support/faq?${params.toString()}`);
      const data = await res.json();

      if (data.ok) {
        setFaqs(data.faqs || []);
      } else {
        setError(data.error || "שגיאה בטעינת FAQ");
      }
    } catch (err) {
      console.error("Error fetching FAQs:", err);
      setError("שגיאה בטעינת FAQ");
    } finally {
      setLoading(false);
    }
  };

  const handleHelpful = async (faqId: number, isHelpful: boolean) => {
    if (helpfulVotes.has(faqId)) return;

    try {
      const res = await fetch(`/api/support/faq/${faqId}/helpful`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_helpful: isHelpful }),
      });

      if (res.ok) {
        setHelpfulVotes(new Set([...helpfulVotes, faqId]));
        // Update helpful count
        setFaqs(faqs.map(f => 
          f.id === faqId ? { ...f, helpful_count: f.helpful_count + (isHelpful ? 1 : 0) } : f
        ));
      }
    } catch (err) {
      console.error("Error marking FAQ as helpful:", err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-800 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-20 bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-red-400">
        {error}
      </div>
    );
  }

  if (faqs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>לא נמצאו שאלות נפוצות</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {faqs.map((faq) => (
        <div
          key={faq.id}
          className="bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
        >
          <button
            onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
            className="w-full flex items-center justify-between p-4 text-right"
          >
            <div className="flex-1 text-right">
              <h3 className="font-semibold text-white mb-1">{faq.question}</h3>
              {faq.category && (
                <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                  {faq.category}
                </span>
              )}
            </div>
            {openId === faq.id ? (
              <ChevronUp className="text-gray-400 flex-shrink-0 mr-3" />
            ) : (
              <ChevronDown className="text-gray-400 flex-shrink-0 mr-3" />
            )}
          </button>

          {openId === faq.id && (
            <div className="px-4 pb-4 border-t border-gray-700">
              <div className="pt-4 text-gray-300 whitespace-pre-wrap">
                {faq.answer}
              </div>

              {faq.tags && faq.tags.length > 0 && (
                <div className="flex gap-2 mt-4 flex-wrap">
                  {faq.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4 mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleHelpful(faq.id, true);
                  }}
                  disabled={helpfulVotes.has(faq.id)}
                  className={`flex items-center gap-1 text-sm transition-colors ${
                    helpfulVotes.has(faq.id)
                      ? "text-green-400 cursor-not-allowed"
                      : "text-gray-400 hover:text-green-400 cursor-pointer"
                  }`}
                >
                  <ThumbsUp size={16} />
                  <span>מועיל ({faq.helpful_count})</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

