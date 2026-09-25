import React, { useState, useMemo } from 'react';
import { supplierStorage, categoryStorage, productStorage, userStorage, activityStorage, settingsStorage, saleStorage, stockMovementStorage } from '../services/storage';
import { useAuth, useToast } from '../context/AuthContext';
import { hasPermission, roleLabels, Role } from '../utils/permissions';
import { formatDate, formatCurrency, formatDateTime, generateId } from '../utils/helpers';
import { Supplier, Category, User } from '../data/seedData';
import { Plus, Edit, Trash2, X, Search, Download, RefreshCw, AlertTriangle, Users as UsersIcon, Package, ShoppingCart } from 'lucide-react';

// ============ SUPPLIERS PAGE ============
export function SuppliersPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', contactPerson: '', phone: '', email: '', location: '', productsSupplied: '' as string });

  const suppliers = useMemo(() => supplierStorage.getAll(), [refreshKey]);
  const categories = useMemo(() => categoryStorage.getAll(), []);

  const openEdit = (s: Supplier) => {
    setEditId(s.id);
    setForm({ name: s.name, contactPerson: s.contactPerson, phone: s.phone, email: s.email, location: s.location, productsSupplied: s.productsSupplied.join(', ') });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) { addToast('error', 'Name is required'); return; }
    const supplied = form.productsSupplied.split(',').map(s => s.trim()).filter(Boolean);
    if (editId) {
      supplierStorage.update(editId, { ...form, productsSupplied: supplied });
      addToast('success', 'Supplier updated');
    } else {
      supplierStorage.create({ id: generateId('sup'), ...form, productsSupplied: supplied, status: 'active', createdAt: new Date().toISOString() });
      addToast('success', 'Supplier added');
    }
    setShowForm(false); setEditId(null); setForm({ name: '', contactPerson: '', phone: '', email: '', location: '', productsSupplied: '' });
    setRefreshKey(k => k + 1);
  };

  const handleDelete = (id: string) => {
    supplierStorage.delete(id);
    setDeleteConfirm(null);
    setRefreshKey(k => k + 1);
    addToast('success', 'Supplier deleted');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-800">Suppliers</h1><p className="text-sm text-gray-500">{suppliers.length} suppliers</p></div>
        {hasPermission(user!.role, 'suppliers_manage') && (
          <button onClick={() => { setEditId(null); setForm({ name: '', contactPerson: '', phone: '', email: '', location: '', productsSupplied: '' }); setShowForm(true); }} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold px-4 py-2.5 rounded-lg text-sm">
            <Plus size={16} /> Add Supplier
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Contact</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Phone</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Location</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Products</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {suppliers.map(s => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{s.name}</td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{s.contactPerson}</td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{s.phone}</td>
                  <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">{s.location}</td>
                  <td className="px-4 py-3 text-gray-600 hidden lg:table-cell"><span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{s.productsSupplied.join(', ')}</span></td>
                  <td className="px-4 py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{s.status}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEdit(s)} className="p-1.5 hover:bg-blue-50 rounded text-gray-500 hover:text-blue-600"><Edit size={15} /></button>
                      <button onClick={() => setDeleteConfirm(s.id)} className="p-1.5 hover:bg-red-50 rounded text-gray-500 hover:text-red-600"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{editId ? 'Edit Supplier' : 'Add Supplier'}</h3>
            <div className="space-y-3">
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Supplier Name *" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm" />
              <input value={form.contactPerson} onChange={e => setForm({ ...form, contactPerson: e.target.value })} placeholder="Contact Person" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm" />
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm" />
              <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm" />
              <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Location" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm" />
              <input value={form.productsSupplied} onChange={e => setForm({ ...form, productsSupplied: e.target.value })} placeholder="Products Supplied (comma separated)" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-gray-900 rounded-lg text-sm font-semibold">Save</button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800">Delete this supplier?</h3>
            <p className="text-sm text-gray-500 mt-1">This action cannot be undone.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ CATEGORIES PAGE ============
export function CategoriesPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', description: '', subcategories: '' });

  const categories = useMemo(() => categoryStorage.getAll(), [refreshKey]);
  const products = useMemo(() => productStorage.getAll(), []);

  const openEdit = (c: Category) => {
    setEditId(c.id);
    setForm({ name: c.name, description: c.description, subcategories: c.subcategories.join(', ') });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) { addToast('error', 'Name is required'); return; }
    const subs = form.subcategories.split(',').map(s => s.trim()).filter(Boolean);
    if (editId) {
      categoryStorage.update(editId, { name: form.name, description: form.description, subcategories: subs });
      addToast('success', 'Category updated');
    } else {
      categoryStorage.create({ id: generateId('cat'), name: form.name, description: form.description, subcategories: subs, createdAt: new Date().toISOString() });
      addToast('success', 'Category added');
    }
    setShowForm(false); setEditId(null); setForm({ name: '', description: '', subcategories: '' });
    setRefreshKey(k => k + 1);
  };

  const handleDelete = (id: string) => {
    const hasProducts = products.some(p => p.category === categories.find(c => c.id === id)?.name);
    if (hasProducts) { addToast('error', 'Cannot delete category with associated products. Reassign products first.'); return; }
    categoryStorage.delete(id);
    setRefreshKey(k => k + 1);
    addToast('success', 'Category deleted');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-800">Categories</h1><p className="text-sm text-gray-500">{categories.length} categories</p></div>
        {hasPermission(user!.role, 'categories_manage') && (
          <button onClick={() => { setEditId(null); setForm({ name: '', description: '', subcategories: '' }); setShowForm(true); }} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold px-4 py-2.5 rounded-lg text-sm">
            <Plus size={16} /> Add Category
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => {
          const count = products.filter(p => p.category === cat.name).length;
          return (
            <div key={cat.id} className="bg-white rounded-xl border p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">{cat.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{cat.description}</p>
                </div>
                {hasPermission(user!.role, 'categories_manage') && (
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(cat)} className="p-1.5 hover:bg-blue-50 rounded text-gray-400 hover:text-blue-600"><Edit size={14} /></button>
                    <button onClick={() => handleDelete(cat.id)} className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-600"><Trash2 size={14} /></button>
                  </div>
                )}
              </div>
              <div className="mt-3 flex items-center gap-3">
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">{count} products</span>
                <span className="text-xs text-gray-500">{cat.subcategories.length} subcategories</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {cat.subcategories.map(sub => (
                  <span key={sub} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{sub}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{editId ? 'Edit Category' : 'Add Category'}</h3>
            <div className="space-y-3">
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Category Name *" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm" />
              <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm" />
              <input value={form.subcategories} onChange={e => setForm({ ...form, subcategories: e.target.value })} placeholder="Subcategories (comma separated)" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-gray-900 rounded-lg text-sm font-semibold">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ REPORTS PAGE ============
export function ReportsPage() {
  const products = useMemo(() => productStorage.getAll(), []);
  const sales = useMemo(() => saleStorage.getAll(), []);
  const movements = useMemo(() => stockMovementStorage.getAll(), []);
  const { addToast } = useToast();

  const totalProducts = products.length;
  const totalUnits = products.reduce((s, p) => s + p.stockQuantity, 0);
  const inventoryValue = products.reduce((s, p) => s + (p.stockQuantity * p.unitCost), 0);
  const lowStock = products.filter(p => p.status === 'low_stock').length;
  const outOfStock = products.filter(p => p.status === 'out_of_stock').length;

  const totalSales = sales.reduce((s, sale) => s + sale.total, 0);
  const totalTransactions = sales.length;

  const categoryReport = products.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = { count: 0, units: 0, value: 0 };
    acc[p.category].count++;
    acc[p.category].units += p.stockQuantity;
    acc[p.category].value += p.stockQuantity * p.unitCost;
    return acc;
  }, {} as Record<string, { count: number; units: number; value: number }>);

  const additions = movements.filter(m => m.type === 'addition');
  const removals = movements.filter(m => m.type === 'removal');
  const saleMovements = movements.filter(m => m.type === 'sale');

  const exportCSV = (data: Record<string, any>[], filename: string) => {
    if (data.length === 0) { addToast('error', 'No data to export'); return; }
    const headers = Object.keys(data[0]);
    const csv = [headers.join(','), ...data.map(row => headers.map(h => `"${row[h]}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
    addToast('success', 'Report exported');
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-800">Reports</h1><p className="text-sm text-gray-500">Inventory and sales analytics</p></div>

      {/* Inventory Report */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Inventory Summary</h3>
          <button onClick={() => exportCSV(products.map(p => ({ Name: p.name, SKU: p.sku, Category: p.category, Brand: p.brand, Stock: p.stockQuantity, 'Unit Cost': p.unitCost, 'Selling Price': p.sellingPrice, Status: p.status })), 'inventory_report.csv')} className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700 font-medium">
            <Download size={14} /> Export CSV
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-blue-50 rounded-lg p-3"><p className="text-xs text-blue-600 font-medium">Total Products</p><p className="text-xl font-bold text-blue-800">{totalProducts}</p></div>
          <div className="bg-green-50 rounded-lg p-3"><p className="text-xs text-green-600 font-medium">Total Units</p><p className="text-xl font-bold text-green-800">{totalUnits.toLocaleString()}</p></div>
          <div className="bg-amber-50 rounded-lg p-3"><p className="text-xs text-amber-600 font-medium">Inventory Value</p><p className="text-xl font-bold text-amber-800">{formatCurrency(inventoryValue)}</p></div>
          <div className="bg-orange-50 rounded-lg p-3"><p className="text-xs text-orange-600 font-medium">Low Stock</p><p className="text-xl font-bold text-orange-800">{lowStock}</p></div>
          <div className="bg-red-50 rounded-lg p-3"><p className="text-xs text-red-600 font-medium">Out of Stock</p><p className="text-xl font-bold text-red-800">{outOfStock}</p></div>
        </div>
      </div>

      {/* Sales Report */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Sales Summary</h3>
          <button onClick={() => exportCSV(sales.map(s => ({ ID: s.saleId, Date: formatDate(s.date), Staff: s.staffName, Items: s.items.length, Total: s.total, Payment: s.paymentMethod })), 'sales_report.csv')} className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700 font-medium">
            <Download size={14} /> Export CSV
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-purple-50 rounded-lg p-3"><p className="text-xs text-purple-600 font-medium">Total Sales</p><p className="text-xl font-bold text-purple-800">{formatCurrency(totalSales)}</p></div>
          <div className="bg-indigo-50 rounded-lg p-3"><p className="text-xs text-indigo-600 font-medium">Transactions</p><p className="text-xl font-bold text-indigo-800">{totalTransactions}</p></div>
          <div className="bg-pink-50 rounded-lg p-3"><p className="text-xs text-pink-600 font-medium">Avg. Sale</p><p className="text-xl font-bold text-pink-800">{totalTransactions > 0 ? formatCurrency(totalSales / totalTransactions) : 'GHS 0.00'}</p></div>
        </div>
      </div>

      {/* Category Report */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Inventory by Category</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b"><tr><th className="text-left px-4 py-2 font-medium text-gray-600">Category</th><th className="text-right px-4 py-2 font-medium text-gray-600">Products</th><th className="text-right px-4 py-2 font-medium text-gray-600">Total Units</th><th className="text-right px-4 py-2 font-medium text-gray-600">Value</th></tr></thead>
            <tbody className="divide-y">
              {Object.entries(categoryReport).map(([cat, data]) => (
                <tr key={cat}><td className="px-4 py-2 font-medium">{cat}</td><td className="px-4 py-2 text-right">{data.count}</td><td className="px-4 py-2 text-right">{data.units.toLocaleString()}</td><td className="px-4 py-2 text-right">{formatCurrency(data.value)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Movement Report */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Stock Movement Report</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-lg p-3"><p className="text-xs text-green-600 font-medium">Stock Added</p><p className="text-xl font-bold text-green-800">{additions.reduce((s, m) => s + m.quantity, 0)} units</p><p className="text-xs text-green-600">{additions.length} transactions</p></div>
          <div className="bg-red-50 rounded-lg p-3"><p className="text-xs text-red-600 font-medium">Stock Removed</p><p className="text-xl font-bold text-red-800">{removals.reduce((s, m) => s + m.quantity, 0)} units</p><p className="text-xs text-red-600">{removals.length} transactions</p></div>
          <div className="bg-blue-50 rounded-lg p-3"><p className="text-xs text-blue-600 font-medium">Stock Sold</p><p className="text-xl font-bold text-blue-800">{saleMovements.reduce((s, m) => s + m.quantity, 0)} units</p><p className="text-xs text-blue-600">{saleMovements.length} transactions</p></div>
        </div>
      </div>
    </div>
  );
}

// ============ USERS PAGE ============
export function UsersPage() {
  const { user: currentUser } = useAuth();
  const { addToast } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'staff' as Role });

  const users = useMemo(() => userStorage.getAll(), [refreshKey]);

  const openEdit = (u: User) => {
    setEditId(u.id);
    setForm({ name: u.name, email: u.email, password: '', role: u.role });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) { addToast('error', 'Name and email are required'); return; }
    if (!editId && !form.password) { addToast('error', 'Password is required for new users'); return; }
    if (!editId && !form.password.match(/^(?=.*[A-Z])(?=.*\d).{6,}$/)) { addToast('error', 'Password must be at least 6 chars with uppercase and number'); return; }

    if (editId) {
      const updates: Partial<User> = { name: form.name, email: form.email, role: form.role };
      if (form.password) updates.password = form.password;
      userStorage.update(editId, updates);
      addToast('success', 'User updated');
    } else {
      userStorage.create({ id: generateId('usr'), name: form.name, email: form.email, password: form.password, role: form.role, status: 'active', lastLogin: null, createdAt: new Date().toISOString() });
      addToast('success', 'User created');
    }
    setShowForm(false); setEditId(null); setForm({ name: '', email: '', password: '', role: 'staff' });
    setRefreshKey(k => k + 1);
  };

  const toggleStatus = (u: User) => {
    userStorage.update(u.id, { status: u.status === 'active' ? 'inactive' : 'active' });
    setRefreshKey(k => k + 1);
    addToast('success', `User ${u.status === 'active' ? 'disabled' : 'enabled'}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-800">Users</h1><p className="text-sm text-gray-500">{users.length} users</p></div>
        <button onClick={() => { setEditId(null); setForm({ name: '', email: '', password: '', role: 'staff' }); setShowForm(true); }} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold px-4 py-2.5 rounded-lg text-sm">
          <Plus size={16} /> Add User
        </button>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Role</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Last Login</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{u.name}</td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{u.email}</td>
                  <td className="px-4 py-3"><span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{roleLabels[u.role]}</span></td>
                  <td className="px-4 py-3 hidden md:table-cell"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{u.status}</span></td>
                  <td className="px-4 py-3 text-gray-500 hidden lg:table-cell text-xs">{u.lastLogin ? formatDateTime(u.lastLogin) : 'Never'}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEdit(u)} className="p-1.5 hover:bg-blue-50 rounded text-gray-500 hover:text-blue-600"><Edit size={15} /></button>
                      <button onClick={() => toggleStatus(u)} className={`p-1.5 rounded text-gray-500 hover:text-orange-600 hover:bg-orange-50`} title={u.status === 'active' ? 'Disable' : 'Enable'}>
                        {u.status === 'active' ? <X size={15} /> : <RefreshCw size={15} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{editId ? 'Edit User' : 'Add User'}</h3>
            <div className="space-y-3">
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full Name *" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm" />
              <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email *" type="email" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm" />
              <input value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder={editId ? 'New Password (leave blank to keep)' : 'Password *'} type="password" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm" />
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value as Role })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm">
                <option value="staff">Staff</option>
                <option value="sales_staff">Sales Staff</option>
                <option value="inventory_manager">Inventory Manager</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-gray-900 rounded-lg text-sm font-semibold">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ ACTIVITY PAGE ============
export function ActivityPage() {
  const activities = useMemo(() => activityStorage.getAll(), []);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return activities;
    const q = search.toLowerCase();
    return activities.filter(a => a.description.toLowerCase().includes(q) || a.userName.toLowerCase().includes(q) || a.action.toLowerCase().includes(q));
  }, [activities, search]);

  const actionColors: Record<string, string> = {
    stock_added: 'bg-green-500', sale_recorded: 'bg-blue-500', product_updated: 'bg-purple-500',
    product_created: 'bg-indigo-500', user_created: 'bg-pink-500', stock_adjusted: 'bg-teal-500',
    supplier_added: 'bg-orange-500',
  };

  return (
    <div className="space-y-4">
      <div><h1 className="text-2xl font-bold text-gray-800">Activity Log</h1><p className="text-sm text-gray-500">{activities.length} activities recorded</p></div>

      <div className="bg-white rounded-xl border p-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search activities..." className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" />
        </div>
      </div>

      <div className="bg-white rounded-xl border p-4">
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No activities found</p>
          ) : filtered.map(act => (
            <div key={act.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
              <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${actionColors[act.action] || 'bg-gray-400'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800">{act.description}</p>
                <p className="text-xs text-gray-500 mt-0.5">{act.userName} • {formatDateTime(act.date)}</p>
              </div>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded flex-shrink-0">{act.action.replace(/_/g, ' ')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============ SETTINGS PAGE ============
export function SettingsPage() {
  const { addToast } = useToast();
  const [settings, setSettings] = useState(() => settingsStorage.get() || { storeName: "Lolo's Auto Store", currency: 'GHS', currencySymbol: 'GHS', location: 'Ghana', lowStockThreshold: 10, taxRate: 0, demoMode: true });
  const [showReset, setShowReset] = useState(false);

  const handleSave = () => {
    settingsStorage.set(settings);
    addToast('success', 'Settings saved');
  };

  const handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div><h1 className="text-2xl font-bold text-gray-800">Settings</h1><p className="text-sm text-gray-500">Manage store configuration</p></div>

      <div className="bg-white rounded-xl border p-6 space-y-4">
        <h3 className="font-semibold text-gray-800">Store Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
            <input value={settings.storeName} onChange={e => setSettings({ ...settings, storeName: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <input value={settings.currency} onChange={e => setSettings({ ...settings, currency: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input value={settings.location} onChange={e => setSettings({ ...settings, location: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Threshold</label>
            <input type="number" value={settings.lowStockThreshold} onChange={e => setSettings({ ...settings, lowStockThreshold: Number(e.target.value) })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm" />
          </div>
        </div>
        <button onClick={handleSave} className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-gray-900 rounded-lg text-sm font-semibold">Save Settings</button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-800">Demo Mode</h3>
            <p className="text-sm text-amber-700 mt-1">Inventory data is stored locally in this browser for demonstration purposes. Authentication and data persistence are not production-secure.</p>
          </div>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <h3 className="font-semibold text-red-800">Development</h3>
        <p className="text-sm text-red-700 mt-1 mb-4">Reset all demo data to initial state. This will clear all products, users, sales, and activity logs.</p>
        <button onClick={() => setShowReset(true)} className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium">Reset Demo Data</button>
      </div>

      {showReset && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800">Reset all demo data?</h3>
            <p className="text-sm text-gray-500 mt-1">This will delete all data and reinitialize the demo dataset. This cannot be undone.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowReset(false)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={handleReset} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">Reset Data</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
