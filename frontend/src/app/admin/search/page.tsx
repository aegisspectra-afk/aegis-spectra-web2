'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, X, Loader2 } from 'lucide-react';
import { useToastContext } from '@/components/ToastProvider';

interface SearchResult {
  type: 'order' | 'product' | 'user' | 'lead' | 'review' | 'blog';
  id: string | number;
  title: string;
  description?: string;
  url: string;
  metadata?: Record<string, any>;
}

export default function AdminSearchPage() {
  const router = useRouter();
  const { showToast } = useToastContext();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    types: [] as string[],
    dateFrom: '',
    dateTo: '',
    status: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
    }
  }, [router]);

  const handleSearch = async () => {
    if (!query.trim()) {
      showToast('אנא הזן שאילתת חיפוש', 'error');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        showToast('אין הרשאה', 'error');
        return;
      }

      const params = new URLSearchParams();
      params.append('q', query);
      if (filters.types.length > 0) {
        params.append('types', filters.types.join(','));
      }
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      if (filters.status) params.append('status', filters.status);

      const res = await fetch(`/api/admin/search?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.ok) {
        setResults(data.results || []);
      } else {
        showToast(data.error || 'שגיאה בחיפוש', 'error');
      }
    } catch (err) {
      console.error('Error searching:', err);
      showToast('שגיאה בחיפוש', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleFilterType = (type: string) => {
    setFilters(prev => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter(t => t !== type)
        : [...prev.types, type],
    }));
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      order: 'הזמנות',
      product: 'מוצרים',
      user: 'משתמשים',
      lead: 'לידים',
      review: 'ביקורות',
      blog: 'בלוג',
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      order: 'bg-blue-500/20 text-blue-400',
      product: 'bg-green-500/20 text-green-400',
      user: 'bg-purple-500/20 text-purple-400',
      lead: 'bg-yellow-500/20 text-yellow-400',
      review: 'bg-orange-500/20 text-orange-400',
      blog: 'bg-pink-500/20 text-pink-400',
    };
    return colors[type] || 'bg-zinc-500/20 text-zinc-400';
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
          <Search className="size-8 text-gold" />
          חיפוש מתקדם
        </h1>

        {/* Search Bar */}
        <div className="bg-black/30 border border-zinc-800 rounded-xl p-6 mb-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-400 size-5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="חפש בכל המערכת..."
                className="w-full pr-12 pl-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-gold"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-3 bg-gold text-black rounded-lg font-semibold hover:bg-gold/90 transition flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="size-5 animate-spin" /> : <Search className="size-5" />}
              חפש
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">סוגי תוצאות</label>
              <div className="flex flex-wrap gap-2">
                {['order', 'product', 'user', 'lead', 'review', 'blog'].map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleFilterType(type)}
                    className={`px-3 py-1 rounded text-sm transition ${
                      filters.types.includes(type)
                        ? 'bg-gold text-black'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    {getTypeLabel(type)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">מתאריך</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">עד תאריך</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">סטטוס</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold"
              >
                <option value="">כל הסטטוסים</option>
                <option value="active">פעיל</option>
                <option value="inactive">לא פעיל</option>
                <option value="pending">ממתין</option>
                <option value="completed">הושלם</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-black/30 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">
              נמצאו {results.length} תוצאות
            </h2>
            <div className="space-y-3">
              {results.map((result, idx) => (
                <a
                  key={idx}
                  href={result.url}
                  className="block p-4 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getTypeColor(result.type)}`}>
                          {getTypeLabel(result.type)}
                        </span>
                        <h3 className="font-semibold text-white">{result.title}</h3>
                      </div>
                      {result.description && (
                        <p className="text-sm text-zinc-400 line-clamp-2">{result.description}</p>
                      )}
                      {result.metadata && (
                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-500">
                          {Object.entries(result.metadata).map(([key, value]) => (
                            <span key={key}>
                              {key}: {String(value)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {!loading && query && results.length === 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-400">לא נמצאו תוצאות</p>
          </div>
        )}
      </div>
    </div>
  );
}

