import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Smartphone,
  Search,
  Plus,
  Star,
  MessageSquare,
  ArrowRight,
  ExternalLink,
  Globe,
  ShoppingBag,
  ShoppingCart,
  Layers,
  ChevronLeft,
  ChevronRight,
  X,
  Tag,
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { productApi } from '../services/api';
import { Product } from '../types';

export const ProductCatalogPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [brandFilter, setBrandFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Add Product Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [newId, setNewId] = useState('');
  const [newName, setNewName] = useState('');
  const [newBrand, setNewBrand] = useState('Apple');
  const [newCategory, setNewCategory] = useState('Smartphones');
  const [newPrice, setNewPrice] = useState('$999');
  const [newAmazon, setNewAmazon] = useState('');
  const [newFlipkart, setNewFlipkart] = useState('');
  const [newOfficial, setNewOfficial] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await productApi.getAll();
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!newId.trim() || !newName.trim()) {
      setFormError('Product ID and Name are required.');
      return;
    }

    try {
      await productApi.create({
        id: newId.trim().toLowerCase().replace(/\s+/g, '_'),
        name: newName.trim(),
        brand: newBrand.trim(),
        category: newCategory,
        price: newPrice.trim(),
        amazon_url: newAmazon.trim() || undefined,
        flipkart_url: newFlipkart.trim() || undefined,
        official_url: newOfficial.trim() || undefined,
        description: newDesc.trim() || undefined,
      });
      setModalOpen(false);
      setNewId('');
      setNewName('');
      setNewDesc('');
      fetchProducts();
    } catch (err: any) {
      setFormError(err?.response?.data?.detail || 'Failed to create product.');
    }
  };

  const categories = [
    'All',
    'Smartphones',
    'Laptops & Computers',
    'Audio & Headphones',
    'Smartwatches & Wearables',
    'Tablets',
    'Cameras & Drones',
    'Gaming & Consoles',
    'Smart Home & TV',
  ];

  const brands = [
    'All',
    'Apple',
    'Samsung',
    'Sony',
    'Google',
    'OnePlus',
    'Dell',
    'HP',
    'Lenovo',
    'Asus',
    'Bose',
    'Xiaomi',
    'Vivo',
    'Oppo',
    'Realme',
    'Nothing',
    'Motorola',
    'Sennheiser',
    'JBL',
    'Marshall',
    'Garmin',
    'Canon',
    'Nikon',
    'Fujifilm',
    'DJI',
    'GoPro',
    'Microsoft',
    'Nintendo',
    'Valve',
  ];

  const filteredProducts = products.filter((p) => {
    const term = search.toLowerCase();
    const matchesSearch =
      !term ||
      p.name.toLowerCase().includes(term) ||
      (p.brand || '').toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term) ||
      (p.description || '').toLowerCase().includes(term);
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesBrand = brandFilter === 'All' || p.brand === brandFilter;
    return matchesSearch && matchesCategory && matchesBrand;
  });

  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleFilterChange = (type: 'category' | 'brand', val: string) => {
    if (type === 'category') setCategoryFilter(val);
    if (type === 'brand') setBrandFilter(val);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 text-xs font-semibold mb-2">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Official Brand Marketplace Fleet ({products.length} Products)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Product Catalog & Stores</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Browse genuine brand tech products with live aspect analysis and direct connections to Amazon, Flipkart, and Official brand websites.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium text-sm shadow-md shadow-cyan-500/20 hover:opacity-95 transition-all inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <GlassCard className="p-4 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search 240+ products by model, brand (Apple, Sony, Samsung), specs..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.03] text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div className="text-xs font-mono text-slate-400 shrink-0">
            Showing <strong className="text-slate-700 dark:text-slate-200">{filteredProducts.length}</strong> products
          </div>
        </div>

        {/* Categories Pills */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Category:</span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleFilterChange('category', cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                  categoryFilter === cat
                    ? 'bg-cyan-500 text-white shadow-sm'
                    : 'border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Brand Selector Pills */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Brand:</span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {brands.map((b) => (
              <button
                key={b}
                onClick={() => handleFilterChange('brand', b)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  brandFilter === b
                    ? 'bg-purple-600 text-white shadow-sm font-semibold'
                    : 'border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Product Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-72 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-2xl">
          <Smartphone className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold">No products match your query</h3>
          <p className="text-xs text-slate-400 mt-1">Try resetting the category or brand filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedProducts.map((p) => {
            const pos = p.sentiment_summary?.Positive || 0;
            const neg = p.sentiment_summary?.Negative || 0;
            const tot = pos + neg + (p.sentiment_summary?.Mixed || 0) + (p.sentiment_summary?.Neutral || 0);
            const posPercent = tot > 0 ? Math.round((pos / tot) * 100) : 85;

            return (
              <GlassCard key={p.id} className="p-5 flex flex-col justify-between" hoverEffect>
                <div>
                  {/* Product Image Card */}
                  <div className="relative w-full h-44 rounded-xl overflow-hidden mb-3.5 bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 group">
                    <img
                      src={p.image_url || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80'}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80';
                      }}
                    />
                    {p.brand && (
                      <span className="absolute top-2.5 left-2.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-md">
                        {p.brand}
                      </span>
                    )}
                    {p.price && (
                      <span className="absolute bottom-2.5 right-2.5 text-xs font-bold font-mono px-2.5 py-1 rounded-lg bg-emerald-500/90 text-white shadow-md backdrop-blur-md">
                        {p.price}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                      {p.category}
                    </span>
                    <span className="text-xs font-semibold text-amber-500 flex items-center gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{p.average_rating ?? '4.6'}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 line-clamp-1">
                    {p.name}
                  </h3>

                  <div className="flex items-center gap-2 mt-1 mb-2">
                    <span className="text-slate-400 text-xs font-mono">
                      {p.review_count} customer reviews
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>

                  {/* Sentiment Bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-mono text-slate-400">Positive Sentiment</span>
                      <span className="font-bold text-emerald-500">{posPercent}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex">
                      <div style={{ width: `${posPercent}%` }} className="h-full bg-emerald-500" />
                      <div
                        style={{
                          width: `${tot > 0 ? Math.round((neg / tot) * 100) : 15}%`,
                        }}
                        className="h-full bg-rose-500"
                      />
                    </div>
                  </div>

                  {/* E-Commerce Shopping Store Connections */}
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/10 space-y-1.5">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
                      Connect & View Product:
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {p.amazon_url && (
                        <a
                          href={p.amazon_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
                          title="View on Amazon"
                        >
                          <ShoppingCart className="w-3 h-3 text-amber-500" />
                          <span>Amazon</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                        </a>
                      )}

                      {p.flipkart_url && (
                        <a
                          href={p.flipkart_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
                          title="View on Flipkart"
                        >
                          <ShoppingBag className="w-3 h-3 text-blue-500" />
                          <span>Flipkart</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                        </a>
                      )}

                      {p.official_url && (
                        <a
                          href={p.official_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors"
                          title="Official Brand Website"
                        >
                          <Globe className="w-3 h-3 text-cyan-500" />
                          <span>Official</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[11px] truncate max-w-[130px]">
                    ID: {p.id.replace('prod_', '')}
                  </span>

                  <Link
                    to={`/products/${p.id}`}
                    className="text-cyan-500 font-semibold hover:text-cyan-400 flex items-center gap-1"
                  >
                    <span>ABSA Intelligence</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 glass-panel rounded-2xl">
          <span className="text-xs font-mono text-slate-400">
            Page <strong className="text-slate-800 dark:text-slate-200">{currentPage}</strong> of{' '}
            <strong className="text-slate-800 dark:text-slate-200">{totalPages}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-500 font-mono">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-md w-full glass-dropdown p-6 rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
              <h3 className="font-bold text-base">Add New Brand Product</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                  Unique ID
                </label>
                <input
                  type="text"
                  value={newId}
                  onChange={(e) => setNewId(e.target.value)}
                  placeholder="prod_sony_wh1000xm6"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-sm"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                  Product Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Sony WH-1000XM6"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    placeholder="Sony"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-sm"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                    Price
                  </label>
                  <input
                    type="text"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="$399"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-sm"
                >
                  {categories.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                  Official Website Link
                </label>
                <input
                  type="url"
                  value={newOfficial}
                  onChange={(e) => setNewOfficial(e.target.value)}
                  placeholder="https://electronics.sony.com/..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-sm"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                  Amazon Product / Search Link
                </label>
                <input
                  type="url"
                  value={newAmazon}
                  onChange={(e) => setNewAmazon(e.target.value)}
                  placeholder="https://www.amazon.com/s?k=..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-sm"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                  Flipkart Product / Search Link
                </label>
                <input
                  type="url"
                  value={newFlipkart}
                  onChange={(e) => setNewFlipkart(e.target.value)}
                  placeholder="https://www.flipkart.com/search?q=..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-sm"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                  Description
                </label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Technical highlights, key audio/camera specifications..."
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-sm"
                />
              </div>

              {formError && (
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs">
                  {formError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-medium shadow-md shadow-cyan-500/20"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
