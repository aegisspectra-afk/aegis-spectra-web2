"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, Plus, Edit2, Trash2, Search, Filter, Package, 
  DollarSign, Tag, Image as ImageIcon, Save, X, RefreshCw
} from "lucide-react";
import { useToast } from "@/components/Toast";
import { ToastContainer } from "@/components/Toast";

type Product = {
  id?: number;
  sku: string;
  name: string;
  description?: string;
  price_regular: number;
  price_sale?: number;
  currency?: string;
  category?: string;
  tags?: string[];
  images?: string[];
  specs?: Record<string, any>;
  brand?: string;
  stock?: number;
  active?: boolean;
};

export default function ProductsManagementPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { toasts, showToast, closeToast } = useToast();

  useEffect(() => {
    const savedAuth = localStorage.getItem("admin_auth");
    const savedPassword = localStorage.getItem("admin_password");
    if (savedAuth === "true" && savedPassword) {
      setIsAuthenticated(true);
      fetchProducts();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const savedPassword = localStorage.getItem("admin_password");
      if (!savedPassword) return;

      const res = await fetch("/api/products", {
        headers: { "Authorization": `Bearer ${savedPassword}` }
      });

      const data = await res.json();
      if (data.ok && data.products) {
        setProducts(data.products);
      } else {
        showToast("שגיאה בטעינת מוצרים", "error");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      showToast("שגיאה בטעינת מוצרים", "error");
    } finally {
      setLoading(false);
    }
  }

  async function saveProduct(product: Product) {
    try {
      const savedPassword = localStorage.getItem("admin_password");
      if (!savedPassword) return;

      const url = product.id ? `/api/products/${product.id}` : "/api/products";
      const method = product.id ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${savedPassword}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
      });

      const data = await res.json();
      if (data.ok) {
        showToast(product.id ? "מוצר עודכן בהצלחה" : "מוצר נוצר בהצלחה", "success");
        fetchProducts();
        setShowForm(false);
        setEditingProduct(null);
      } else {
        showToast("שגיאה בשמירת מוצר", "error");
      }
    } catch (err) {
      console.error("Error saving product:", err);
      showToast("שגיאה בשמירת מוצר", "error");
    }
  }

  async function deleteProduct(id: number) {
    if (!confirm("האם אתה בטוח שברצונך למחוק את המוצר?")) return;

    try {
      const savedPassword = localStorage.getItem("admin_password");
      if (!savedPassword) return;

      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${savedPassword}` }
      });

      const data = await res.json();
      if (data.ok) {
        showToast("מוצר נמחק בהצלחה", "success");
        fetchProducts();
      } else {
        showToast("שגיאה במחיקת מוצר", "error");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      showToast("שגיאה במחיקת מוצר", "error");
    }
  }

  const filteredProducts = products.filter(p => {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !p.sku.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (categoryFilter !== "all" && p.category !== categoryFilter) {
      return false;
    }
    return true;
  });

  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">נדרשת התחברות</p>
          <a href="/admin" className="text-gold">חזור לדף ההתחברות</a>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen">
      <ToastContainer toasts={toasts} onClose={closeToast} />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(113,113,122,0.12),transparent),linear-gradient(#0B0B0D,#141418)]" />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Package className="text-gold size-8" />
            <div>
              <h1 className="text-3xl font-extrabold">ניהול מוצרים</h1>
              <p className="text-zinc-400 text-sm mt-1">Aegis Spectra - Products Management</p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingProduct(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-gold text-black px-6 py-3 font-semibold hover:bg-gold/90 transition"
          >
            <Plus className="size-5" />
            מוצר חדש
          </button>
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-zinc-800 bg-black/30 p-6 mb-6 backdrop-blur-sm">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="חיפוש לפי שם או SKU..."
                className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:border-gold/70 transition"
              />
            </div>
            <div>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-zinc-400 pointer-events-none" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-3 appearance-none focus:outline-none focus:border-gold/70 transition"
              >
                <option value="all">כל הקטגוריות</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Product Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="rounded-2xl border border-zinc-800 bg-black/30 p-6 mb-6 backdrop-blur-sm"
            >
              <ProductForm
                product={editingProduct}
                onSave={(p) => {
                  saveProduct(p);
                }}
                onCancel={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products List */}
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="size-8 animate-spin mx-auto mb-4 text-gold" />
            <p className="opacity-70">טוען מוצרים...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-zinc-800 bg-black/30 p-6 backdrop-blur-sm hover:border-zinc-600 transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">{product.name}</h3>
                    <p className="text-sm text-zinc-400">SKU: {product.sku}</p>
                    {product.category && (
                      <span className="inline-block mt-2 px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-300">
                        {product.category}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setShowForm(true);
                      }}
                      className="p-2 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition"
                    >
                      <Edit2 className="size-4" />
                    </button>
                    <button
                      onClick={() => product.id && deleteProduct(product.id)}
                      className="p-2 rounded-lg border border-red-500/50 hover:bg-red-500/20 transition"
                    >
                      <Trash2 className="size-4 text-red-400" />
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    {product.price_sale ? (
                      <>
                        <span className="text-2xl font-bold text-gold">{product.price_sale} ₪</span>
                        <span className="text-sm line-through opacity-60">{product.price_regular} ₪</span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-white">{product.price_regular} ₪</span>
                    )}
                  </div>
                  {product.stock !== undefined && (
                    <p className="text-sm text-zinc-400 mt-2">מלאי: {product.stock}</p>
                  )}
                </div>
                {product.description && (
                  <p className="text-sm text-zinc-300 mb-4 line-clamp-2">{product.description}</p>
                )}
                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="size-12 mx-auto mb-4 text-zinc-400" />
            <p className="text-zinc-400">לא נמצאו מוצרים</p>
          </div>
        )}
      </div>
    </main>
  );
}

function ProductForm({ product, onSave, onCancel }: { 
  product: Product | null; 
  onSave: (p: Product) => void; 
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Product>({
    sku: product?.sku || "",
    name: product?.name || "",
    description: product?.description || "",
    price_regular: product?.price_regular || 0,
    price_sale: product?.price_sale,
    currency: product?.currency || "ILS",
    category: product?.category || "",
    tags: product?.tags || [],
    images: product?.images || [],
    brand: product?.brand || "",
    stock: product?.stock || 0,
    active: product?.active !== false,
    ...(product?.id && { id: product.id })
  });

  const [tagInput, setTagInput] = useState("");

  function addTag() {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()]
      });
      setTagInput("");
    }
  }

  function removeTag(tag: string) {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(t => t !== tag) || []
    });
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSave(formData);
    }} className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{product ? "עריכת מוצר" : "מוצר חדש"}</h2>
        <button type="button" onClick={onCancel} className="p-2 rounded-lg hover:bg-zinc-800 transition">
          <X className="size-5" />
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-2">SKU *</label>
          <input
            type="text"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            required
            className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:border-gold/70 transition"
          />
        </div>
        <div>
          <label className="block text-sm mb-2">שם מוצר *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:border-gold/70 transition"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm mb-2">תיאור</label>
          <textarea
            value={formData.description || ""}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:border-gold/70 transition"
          />
        </div>
        <div>
          <label className="block text-sm mb-2">מחיר רגיל (₪) *</label>
          <input
            type="number"
            value={formData.price_regular}
            onChange={(e) => setFormData({ ...formData, price_regular: parseFloat(e.target.value) || 0 })}
            required
            min="0"
            step="0.01"
            className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:border-gold/70 transition"
          />
        </div>
        <div>
          <label className="block text-sm mb-2">מחיר מבצע (₪)</label>
          <input
            type="number"
            value={formData.price_sale || ""}
            onChange={(e) => setFormData({ ...formData, price_sale: e.target.value ? parseFloat(e.target.value) : undefined })}
            min="0"
            step="0.01"
            className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:border-gold/70 transition"
          />
        </div>
        <div>
          <label className="block text-sm mb-2">קטגוריה</label>
          <input
            type="text"
            value={formData.category || ""}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="לדוגמה: Home Security, Business, IoT"
            className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:border-gold/70 transition"
          />
        </div>
        <div>
          <label className="block text-sm mb-2">מותג (לדוגמה: Provision, Hikvision)</label>
          <input
            type="text"
            value={formData.brand || ""}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:border-gold/70 transition"
          />
        </div>
        <div>
          <label className="block text-sm mb-2">מלאי</label>
          <input
            type="number"
            value={formData.stock || 0}
            onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
            min="0"
            className="w-full bg-black/30 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:border-gold/70 transition"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.active}
            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
            className="size-5 rounded border-zinc-700"
          />
          <label className="text-sm">פעיל</label>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm mb-2">תגיות</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              placeholder="הוסף תגית..."
              className="flex-1 bg-black/30 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:border-gold/70 transition"
            />
            <button type="button" onClick={addTag} className="px-4 py-2 bg-zinc-700 rounded-lg hover:bg-zinc-600 transition">
              הוסף
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags?.map((tag, i) => (
              <span key={i} className="flex items-center gap-2 px-3 py-1 bg-zinc-800 rounded-full text-sm">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="text-red-400 hover:text-red-300">
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gold text-black px-6 py-3 font-semibold hover:bg-gold/90 transition"
        >
          <Save className="size-5" />
          שמור
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-xl border border-zinc-700 hover:bg-zinc-800 transition"
        >
          ביטול
        </button>
      </div>
    </form>
  );
}

