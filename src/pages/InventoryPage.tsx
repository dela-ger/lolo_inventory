import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { productStorage, categoryStorage, supplierStorage } from '../services/storage';
import { useAuth, useToast } from '../context/AuthContext';
import { hasPermission } from '../utils/permissions';
import { formatCurrency, formatDate, getStockStatus } from '../utils/helpers';
import { Product } from '../data/seedData';
import { Search, Plus, Filter, ChevronLeft, ChevronRight, Eye, Edit, Trash2, ArrowUpDown, X, Package } from 'lucide-react';

export default function InventoryPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [showFilters, setShowFilters] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const categories = useMemo(() => categoryStorage.getAll(), [refreshKey]);
  const suppliers = useMemo(() => supplierStorage.getAll(), [refreshKey]);

  const allProducts = useMemo(() => productStorage.getAll(), [refreshKey]);

  const brands = useMemo(() => [...new Set(allProducts.map(p => p.brand))].sort(), [allProducts]);

  const filtered = useMemo(() => {
    let result = [...allProducts];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.vehicleCompatibility.toLowerCase().includes(q)
      );
    }
    if (categoryFilter) result = result.filter(p => p.category === categoryFilter);
    if (statusFilter) result = result.filter(p => p.status === statusFilter);
    if (brandFilter) result = result.filter(p => p.brand === brandFilter);

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case 'name': cmp = a.name.localeCompare(b.name); break;
        case 'stock': cmp = a.stockQuantity - b.stockQuantity; break;
        case 'price': cmp = a.sellingPrice - b.sellingPrice; break;
        case 'category': cmp = a.category.localeCompare(b.category); break;
        case 'date': cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(); break;
        default: cmp = 0;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [allProducts, search, categoryFilter, statusFilter, brandFilter, sortBy, sortDir]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (field: string) => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortDir('asc'); }
  };

  const handleDelete = (id: string) => {
    productStorage.delete(id);
    setDeleteConfirm(null);
    setRefreshKey(k => k + 1);
    addToast('success', 'Product deleted successfully');
  };

  const clearFilters = () => {
    setSearch(''); setCategoryFilter(''); setStatusFilter(''); setBrandFilter(''); setPage(1);
  };

  const hasActiveFilters = categoryFilter || statusFilter || brandFilter;

  const statusBadge = (status: string) => {
    const styles = {
      in_stock: 'bg-green-100 text-green-700',
      low_stock: 'bg-amber-100 text-amber-700',
      out_of_stock: 'bg-red-100 text-red-700',
    };
    const labels = { in_stock: 'In Stock', low_stock: 'Low Stock', out_of_stock: 'Out of Stock' };
    return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[status as keyof typeof styles]}`}>{labels[status as keyof typeof labels]}</span>;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Inventory</h1>
          <p className="text-sm text-gray-500">{filtered.length} products found</p>
        </div>
        {hasPermission(user!.role, 'inventory_create') && (
          <button onClick={() => navigate('/inventory/new')} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold px-4 py-2.5 rounded-lg text-sm">
            <Plus size={16} /> Add Product
          </button>
        )}
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name, SKU, brand, category..."
              className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium ${showFilters || hasActiveFilters ? 'border-amber-500 text-amber-700 bg-amber-50' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
            <Filter size={16} /> Filters {hasActiveFilters && `(${[categoryFilter, statusFilter, brandFilter].filter(Boolean).length})`}
          </button>
        </div>

        {showFilters && (
          <div className="mt-3 pt-3 border-t grid grid-cols-1 sm:grid-cols-3 gap-3">
            <select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setPage(1); }} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
            <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="">All Status</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
            <select value={brandFilter} onChange={e => { setBrandFilter(e.target.value); setPage(1); }} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="">All Brands</option>
              {brands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 sm:col-span-3">
                <X size={14} /> Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  <button onClick={() => handleSort('name')} className="flex items-center gap-1 hover:text-gray-800">
                    Product <ArrowUpDown size={12} />
                  </button>
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">SKU</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">
                  <button onClick={() => handleSort('category')} className="flex items-center gap-1 hover:text-gray-800">
                    Category <ArrowUpDown size={12} />
                  </button>
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Brand</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  <button onClick={() => handleSort('stock')} className="flex items-center gap-1 hover:text-gray-800">
                    Stock <ArrowUpDown size={12} />
                  </button>
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">
                  <button onClick={() => handleSort('price')} className="flex items-center gap-1 hover:text-gray-800">
                    Price <ArrowUpDown size={12} />
                  </button>
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden xl:table-cell">Status</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginated.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-gray-500">
                  <Package size={32} className="mx-auto mb-2 text-gray-300" />
                  No products found
                </td></tr>
              ) : paginated.map(product => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-800">{product.name}</p>
                      <p className="text-xs text-gray-500 md:hidden">{product.sku}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell font-mono text-xs">{product.sku}</td>
                  <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">{product.category}</td>
                  <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">{product.brand}</td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${product.stockQuantity === 0 ? 'text-red-600' : product.stockQuantity <= product.minimumStock ? 'text-amber-600' : 'text-gray-800'}`}>
                      {product.stockQuantity}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">/ {product.minimumStock}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-800 hidden md:table-cell">{formatCurrency(product.sellingPrice)}</td>
                  <td className="px-4 py-3 hidden xl:table-cell">{statusBadge(product.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => navigate(`/inventory/${product.id}`)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700" title="View">
                        <Eye size={15} />
                      </button>
                      {hasPermission(user!.role, 'inventory_edit') && (
                        <button onClick={() => navigate(`/inventory/${product.id}/edit`)} className="p-1.5 hover:bg-blue-50 rounded text-gray-500 hover:text-blue-600" title="Edit">
                          <Edit size={15} />
                        </button>
                      )}
                      {hasPermission(user!.role, 'inventory_delete') && (
                        <button onClick={() => setDeleteConfirm(product.id)} className="p-1.5 hover:bg-red-50 rounded text-gray-500 hover:text-red-600" title="Delete">
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Show</span>
              <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }} className="border rounded px-2 py-1 text-sm">
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>of {filtered.length} products</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) pageNum = i + 1;
                else if (page <= 3) pageNum = i + 1;
                else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = page - 2 + i;
                return (
                  <button key={pageNum} onClick={() => setPage(pageNum)} className={`w-8 h-8 rounded text-sm font-medium ${page === pageNum ? 'bg-amber-500 text-gray-900' : 'hover:bg-gray-100 text-gray-600'}`}>
                    {pageNum}
                  </button>
                );
              })}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800">Delete this product?</h3>
            <p className="text-sm text-gray-500 mt-1">This action cannot be undone. The product will be permanently removed from inventory.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">Delete Product</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
