import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productStorage, categoryStorage, supplierStorage, activityStorage, stockMovementStorage } from '../services/storage';
import { useAuth, useToast } from '../context/AuthContext';
import { Product } from '../data/seedData';
import { formatCurrency, formatDate, formatDateTime, getStockStatus, generateId } from '../utils/helpers';
import { ArrowLeft, Save, Package, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

export function ProductFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const categories = useMemo(() => categoryStorage.getAll(), []);
  const suppliers = useMemo(() => supplierStorage.getAll(), []);

  const [form, setForm] = useState({
    name: '', sku: '', category: '', subcategory: '', brand: '', description: '',
    vehicleCompatibility: '', unitCost: '', sellingPrice: '', stockQuantity: '',
    minimumStock: '', supplier: '', location: '', status: 'in_stock' as Product['status'],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit && id) {
      const product = productStorage.getById(id);
      if (product) {
        setForm({
          name: product.name, sku: product.sku, category: product.category,
          subcategory: product.subcategory, brand: product.brand, description: product.description,
          vehicleCompatibility: product.vehicleCompatibility, unitCost: product.unitCost.toString(),
          sellingPrice: product.sellingPrice.toString(), stockQuantity: product.stockQuantity.toString(),
          minimumStock: product.minimumStock.toString(), supplier: product.supplier,
          location: product.location, status: product.status,
        });
      } else {
        navigate('/inventory');
      }
    }
  }, [id, isEdit]);

  const selectedCategory = categories.find(c => c.name === form.category);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Product name is required';
    if (!form.sku.trim()) errs.sku = 'SKU is required';
    else if (!productStorage.isSkuUnique(form.sku, id)) errs.sku = 'SKU already exists';
    if (!form.category) errs.category = 'Category is required';
    if (!form.brand.trim()) errs.brand = 'Brand is required';
    if (!form.unitCost || Number(form.unitCost) < 0) errs.unitCost = 'Valid unit cost is required';
    if (!form.sellingPrice || Number(form.sellingPrice) < 0) errs.sellingPrice = 'Valid selling price is required';
    if (form.stockQuantity === '' || Number(form.stockQuantity) < 0) errs.stockQuantity = 'Valid stock quantity is required';
    if (form.minimumStock === '' || Number(form.minimumStock) < 0) errs.minimumStock = 'Valid minimum stock is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const status = getStockStatus(Number(form.stockQuantity), Number(form.minimumStock));

    if (isEdit && id) {
      productStorage.update(id, {
        name: form.name, sku: form.sku, category: form.category, subcategory: form.subcategory,
        brand: form.brand, description: form.description, vehicleCompatibility: form.vehicleCompatibility,
        unitCost: Number(form.unitCost), sellingPrice: Number(form.sellingPrice),
        minimumStock: Number(form.minimumStock), supplier: form.supplier, location: form.location, status,
      });
      activityStorage.create({
        id: generateId('act'), userId: user!.id, userName: user!.name,
        action: 'product_updated', resource: 'inventory',
        description: `Updated product "${form.name}"`, date: new Date().toISOString(),
      });
      addToast('success', 'Product updated successfully');
    } else {
      const newProduct: Product = {
        id: generateId('prod'), name: form.name, sku: form.sku, category: form.category,
        subcategory: form.subcategory, brand: form.brand, description: form.description,
        vehicleCompatibility: form.vehicleCompatibility, unitCost: Number(form.unitCost),
        sellingPrice: Number(form.sellingPrice), stockQuantity: Number(form.stockQuantity),
        minimumStock: Number(form.minimumStock), supplier: form.supplier, location: form.location,
        status, image: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      };
      productStorage.create(newProduct);
      activityStorage.create({
        id: generateId('act'), userId: user!.id, userName: user!.name,
        action: 'product_created', resource: 'inventory',
        description: `Created new product "${form.name}"`, date: new Date().toISOString(),
      });
      addToast('success', 'Product created successfully');
    }
    navigate('/inventory');
  };

  const inputClass = (field: string) => `w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none ${errors[field] ? 'border-red-300' : 'border-gray-300'}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/inventory')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="text-sm text-gray-500">{isEdit ? 'Update product information' : 'Add a new product to inventory'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputClass('name')} placeholder="e.g. Castrol GTX 20W-50" />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
            <input value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} className={inputClass('sku')} placeholder="e.g. LA-OIL0001" />
            {errors.sku && <p className="text-xs text-red-500 mt-1">{errors.sku}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value, subcategory: '' })} className={inputClass('category')}>
              <option value="">Select category</option>
              {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
            {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
            <select value={form.subcategory} onChange={e => setForm({ ...form, subcategory: e.target.value })} className={inputClass('subcategory')}>
              <option value="">Select subcategory</option>
              {selectedCategory?.subcategories.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
            <input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} className={inputClass('brand')} placeholder="e.g. Castrol" />
            {errors.brand && <p className="text-xs text-red-500 mt-1">{errors.brand}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Compatibility</label>
            <input value={form.vehicleCompatibility} onChange={e => setForm({ ...form, vehicleCompatibility: e.target.value })} className={inputClass('vehicleCompatibility')} placeholder="e.g. Toyota Corolla, Universal" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unit Cost (GHS) *</label>
            <input type="number" step="0.01" value={form.unitCost} onChange={e => setForm({ ...form, unitCost: e.target.value })} className={inputClass('unitCost')} placeholder="0.00" />
            {errors.unitCost && <p className="text-xs text-red-500 mt-1">{errors.unitCost}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (GHS) *</label>
            <input type="number" step="0.01" value={form.sellingPrice} onChange={e => setForm({ ...form, sellingPrice: e.target.value })} className={inputClass('sellingPrice')} placeholder="0.00" />
            {errors.sellingPrice && <p className="text-xs text-red-500 mt-1">{errors.sellingPrice}</p>}
          </div>
          {!isEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
              <input type="number" value={form.stockQuantity} onChange={e => setForm({ ...form, stockQuantity: e.target.value })} className={inputClass('stockQuantity')} placeholder="0" />
              {errors.stockQuantity && <p className="text-xs text-red-500 mt-1">{errors.stockQuantity}</p>}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Stock Level *</label>
            <input type="number" value={form.minimumStock} onChange={e => setForm({ ...form, minimumStock: e.target.value })} className={inputClass('minimumStock')} placeholder="0" />
            {errors.minimumStock && <p className="text-xs text-red-500 mt-1">{errors.minimumStock}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
            <select value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })} className={inputClass('supplier')}>
              <option value="">Select supplier</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location / Shelf</label>
            <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className={inputClass('location')} placeholder="e.g. A1-5" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className={inputClass('description')} placeholder="Product description..." />
        </div>
        <div className="flex gap-3 pt-4 border-t">
          <button type="button" onClick={() => navigate('/inventory')} className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
          <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-gray-900 rounded-lg text-sm font-semibold">
            <Save size={16} /> {isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);
  const [showAdjust, setShowAdjust] = useState(false);
  const [adjustType, setAdjustType] = useState<'addition' | 'removal' | 'adjustment'>('addition');
  const [adjustQty, setAdjustQty] = useState('');
  const [adjustReason, setAdjustReason] = useState('');

  const product = useMemo(() => id ? productStorage.getById(id) : null, [id, refreshKey]);
  const movements = useMemo(() => {
    if (!id) return [];
    return stockMovementStorage.getAll().filter(m => m.productId === id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [id, refreshKey]);

  if (!product) return (
    <div className="text-center py-12">
      <Package size={48} className="mx-auto text-gray-300 mb-3" />
      <p className="text-gray-500">Product not found</p>
      <button onClick={() => navigate('/inventory')} className="mt-4 text-amber-600 hover:text-amber-700 text-sm font-medium">Back to Inventory</button>
    </div>
  );

  const handleStockAdjust = () => {
    const qty = Number(adjustQty);
    if (!qty || qty <= 0) { addToast('error', 'Enter a valid quantity'); return; }
    if (!adjustReason.trim()) { addToast('error', 'Enter a reason for adjustment'); return; }

    let newStock = product.stockQuantity;
    if (adjustType === 'addition') newStock += qty;
    else if (adjustType === 'removal') { if (qty > product.stockQuantity) { addToast('error', 'Cannot remove more than current stock'); return; } newStock -= qty; }
    else newStock = qty;

    productStorage.update(product.id, { stockQuantity: newStock, status: getStockStatus(newStock, product.minimumStock) });
    stockMovementStorage.create({
      id: generateId('sm'), productId: product.id, productName: product.name,
      type: adjustType, quantity: adjustType === 'adjustment' ? Math.abs(newStock - product.stockQuantity) : qty,
      previousStock: product.stockQuantity, newStock, reason: adjustReason,
      userId: user!.id, userName: user!.name, date: new Date().toISOString(),
    });
    activityStorage.create({
      id: generateId('act'), userId: user!.id, userName: user!.name,
      action: 'stock_adjusted', resource: 'inventory',
      description: `${adjustType === 'addition' ? 'Added' : adjustType === 'removal' ? 'Removed' : 'Adjusted'} ${qty} units of ${product.name}`,
      date: new Date().toISOString(),
    });

    addToast('success', `Stock ${adjustType === 'addition' ? 'added' : adjustType === 'removal' ? 'removed' : 'adjusted'} successfully`);
    setShowAdjust(false);
    setAdjustQty('');
    setAdjustReason('');
    setRefreshKey(k => k + 1);
  };

  const statusBadge = (status: string) => {
    const styles = { in_stock: 'bg-green-100 text-green-700', low_stock: 'bg-amber-100 text-amber-700', out_of_stock: 'bg-red-100 text-red-700' };
    const labels = { in_stock: 'In Stock', low_stock: 'Low Stock', out_of_stock: 'Out of Stock' };
    return <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${styles[status as keyof typeof styles]}`}>{labels[status as keyof typeof labels]}</span>;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/inventory')} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={20} /></button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-sm text-gray-500">{product.sku} • {product.brand}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowAdjust(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            <RefreshCw size={14} /> Adjust Stock
          </button>
          <button onClick={() => navigate(`/inventory/${id}/edit`)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">Edit</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border p-6 space-y-4">
          <h3 className="font-semibold text-gray-800">Product Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-500">Category:</span> <span className="font-medium">{product.category}</span></div>
            <div><span className="text-gray-500">Subcategory:</span> <span className="font-medium">{product.subcategory || '—'}</span></div>
            <div><span className="text-gray-500">Brand:</span> <span className="font-medium">{product.brand}</span></div>
            <div><span className="text-gray-500">Compatibility:</span> <span className="font-medium">{product.vehicleCompatibility || '—'}</span></div>
            <div><span className="text-gray-500">Location:</span> <span className="font-medium">{product.location || '—'}</span></div>
            <div><span className="text-gray-500">Status:</span> {statusBadge(product.status)}</div>
          </div>
          {product.description && <div className="pt-3 border-t"><p className="text-sm text-gray-600">{product.description}</p></div>}
        </div>

        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h3 className="font-semibold text-gray-800">Stock & Pricing</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Current Stock</span><span className="font-bold text-lg">{product.stockQuantity}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Minimum Stock</span><span className="font-medium">{product.minimumStock}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Unit Cost</span><span className="font-medium">{formatCurrency(product.unitCost)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Selling Price</span><span className="font-medium">{formatCurrency(product.sellingPrice)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Stock Value</span><span className="font-medium">{formatCurrency(product.stockQuantity * product.unitCost)}</span></div>
          </div>
        </div>
      </div>

      {/* Stock History */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Stock Movement History</h3>
        {movements.length === 0 ? (
          <p className="text-sm text-gray-500">No stock movements recorded</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {movements.map(m => (
              <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  {m.type === 'addition' ? <TrendingUp size={16} className="text-green-600" /> :
                   m.type === 'removal' || m.type === 'sale' ? <TrendingDown size={16} className="text-red-600" /> :
                   <RefreshCw size={16} className="text-blue-600" />}
                  <div>
                    <p className="text-sm font-medium">{m.reason}</p>
                    <p className="text-xs text-gray-500">{m.userName} • {formatDateTime(m.date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${m.type === 'addition' ? 'text-green-600' : 'text-red-600'}`}>
                    {m.type === 'addition' ? '+' : '-'}{m.quantity}
                  </p>
                  <p className="text-xs text-gray-500">{m.previousStock} → {m.newStock}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stock Adjustment Modal */}
      {showAdjust && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Adjust Stock</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                {(['addition', 'removal', 'adjustment'] as const).map(type => (
                  <button key={type} onClick={() => setAdjustType(type)} className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border ${adjustType === type ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                    {type === 'addition' ? '+ Add' : type === 'removal' ? '- Remove' : '= Set'}
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {adjustType === 'adjustment' ? 'New Stock Quantity' : 'Quantity'}
                </label>
                <input type="number" value={adjustQty} onChange={e => setAdjustQty(e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm" placeholder={adjustType === 'adjustment' ? `Current: ${product.stockQuantity}` : '0'} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
                <input value={adjustReason} onChange={e => setAdjustReason(e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm" placeholder="e.g. New shipment, Damaged, Physical count" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAdjust(false)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={handleStockAdjust} className="flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-gray-900 rounded-lg text-sm font-semibold">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
