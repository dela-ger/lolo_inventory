import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productStorage, saleStorage, activityStorage, stockMovementStorage } from '../services/storage';
import { useAuth, useToast } from '../context/AuthContext';
import { formatCurrency, formatDate, formatDateTime, getStockStatus, generateId } from '../utils/helpers';
import { Search, Plus, Minus, Trash2, ShoppingCart, ArrowLeft, X } from 'lucide-react';

interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export function NewSalePage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'mobile_money' | 'card' | 'bank_transfer'>('cash');
  const [discount, setDiscount] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);

  const products = useMemo(() => productStorage.getAll().filter(p => p.stockQuantity > 0), []);

  const filteredProducts = useMemo(() => {
    if (!search) return products.slice(0, 20);
    const q = search.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
    ).slice(0, 20);
  }, [products, search]);

  const addToCart = (product: typeof products[0]) => {
    const existing = cart.find(c => c.productId === product.id);
    if (existing) {
      if (existing.quantity >= product.stockQuantity) {
        addToast('error', 'Insufficient stock available');
        return;
      }
      setCart(cart.map(c => c.productId === product.id ? { ...c, quantity: c.quantity + 1, subtotal: (c.quantity + 1) * c.unitPrice } : c));
    } else {
      setCart([...cart, { productId: product.id, productName: product.name, quantity: 1, unitPrice: product.sellingPrice, subtotal: product.sellingPrice }]);
    }
    setSearch('');
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart(cart.map(c => {
      if (c.productId !== productId) return c;
      const product = products.find(p => p.id === productId);
      const newQty = c.quantity + delta;
      if (newQty <= 0) return c;
      if (product && newQty > product.stockQuantity) { addToast('error', 'Insufficient stock'); return c; }
      return { ...c, quantity: newQty, subtotal: newQty * c.unitPrice };
    }));
  };

  const removeFromCart = (productId: string) => setCart(cart.filter(c => c.productId !== productId));

  const subtotal = cart.reduce((sum, c) => sum + c.subtotal, 0);
  const total = subtotal - discount;

  const completeSale = () => {
    if (cart.length === 0) { addToast('error', 'Cart is empty'); return; }

    const saleId = `LS-${String(Date.now()).slice(-5)}`;
    const sale = {
      id: generateId('sale'), saleId, date: new Date().toISOString(),
      staffId: user!.id, staffName: user!.name, items: cart,
      subtotal, discount, tax: 0, total, paymentMethod, status: 'completed' as const,
    };

    saleStorage.create(sale);

    // Reduce stock for each item
    cart.forEach(item => {
      const product = productStorage.getById(item.productId);
      if (product) {
        const newStock = product.stockQuantity - item.quantity;
        productStorage.update(product.id, { stockQuantity: newStock, status: getStockStatus(newStock, product.minimumStock) });
        stockMovementStorage.create({
          id: generateId('sm'), productId: product.id, productName: product.name,
          type: 'sale', quantity: item.quantity, previousStock: product.stockQuantity, newStock,
          reason: `Sale ${saleId}`, userId: user!.id, userName: user!.name, date: new Date().toISOString(),
        });
      }
    });

    activityStorage.create({
      id: generateId('act'), userId: user!.id, userName: user!.name,
      action: 'sale_recorded', resource: 'sales',
      description: `Recorded sale ${saleId} — ${formatCurrency(total)}`, date: new Date().toISOString(),
    });

    addToast('success', `Sale ${saleId} completed — ${formatCurrency(total)}`);
    navigate('/sales');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/sales')} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={20} /></button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">New Sale</h1>
          <p className="text-sm text-gray-500">Point of Sale</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Search */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border p-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search products by name, SKU, or brand..."
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                autoFocus
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              {search ? `Results for "${search}"` : 'Available Products'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-96 overflow-y-auto">
              {filteredProducts.map(p => (
                <button key={p.id} onClick={() => addToCart(p)} className="text-left p-3 rounded-lg border hover:border-amber-500 hover:bg-amber-50 transition-colors">
                  <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">{p.brand} • Stock: {p.stockQuantity}</span>
                    <span className="text-sm font-semibold text-amber-700">{formatCurrency(p.sellingPrice)}</span>
                  </div>
                </button>
              ))}
              {filteredProducts.length === 0 && <p className="text-sm text-gray-500 col-span-2 text-center py-4">No products found</p>}
            </div>
          </div>
        </div>

        {/* Cart */}
        <div className="bg-white rounded-xl border p-4 flex flex-col">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <ShoppingCart size={16} /> Cart ({cart.length} items)
          </h3>

          <div className="flex-1 space-y-2 max-h-64 overflow-y-auto">
            {cart.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">Cart is empty</p>
            ) : cart.map(item => (
              <div key={item.productId} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate">{item.productName}</p>
                  <p className="text-xs text-gray-500">{formatCurrency(item.unitPrice)} × {item.quantity}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => updateCartQty(item.productId, -1)} className="w-6 h-6 flex items-center justify-center rounded bg-gray-200 hover:bg-gray-300"><Minus size={12} /></button>
                  <span className="text-xs font-medium w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateCartQty(item.productId, 1)} className="w-6 h-6 flex items-center justify-center rounded bg-gray-200 hover:bg-gray-300"><Plus size={12} /></button>
                </div>
                <button onClick={() => removeFromCart(item.productId)} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>

          <div className="border-t pt-3 mt-3 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span className="font-medium">{formatCurrency(subtotal)}</span></div>
            <div className="flex justify-between text-sm items-center">
              <span className="text-gray-500">Discount</span>
              <input type="number" value={discount || ''} onChange={e => setDiscount(Math.max(0, Number(e.target.value)))} className="w-24 px-2 py-1 border rounded text-sm text-right" placeholder="0" />
            </div>
            <div className="flex justify-between text-base font-bold border-t pt-2"><span>Total</span><span className="text-amber-700">{formatCurrency(total)}</span></div>
          </div>

          <button onClick={() => setShowCheckout(true)} disabled={cart.length === 0} className="mt-4 w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-semibold rounded-lg text-sm">
            Complete Sale
          </button>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Complete Sale</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['cash', 'mobile_money', 'card', 'bank_transfer'] as const).map(method => (
                    <button key={method} onClick={() => setPaymentMethod(method)} className={`p-2.5 rounded-lg border text-sm font-medium ${paymentMethod === method ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                      {method === 'cash' ? '💵 Cash' : method === 'mobile_money' ? '📱 MoMo' : method === 'card' ? '💳 Card' : '🏦 Transfer'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between text-sm"><span>Total Amount</span><span className="font-bold text-lg">{formatCurrency(total)}</span></div>
                <div className="text-xs text-gray-500 mt-1">{cart.length} items • {cart.reduce((s, c) => s + c.quantity, 0)} units</div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowCheckout(false)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={completeSale} className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold">Confirm Sale</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function SalesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const sales = useMemo(() => {
    let result = saleStorage.getAll().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s => s.saleId.toLowerCase().includes(q) || s.staffName.toLowerCase().includes(q));
    }
    if (paymentFilter) result = result.filter(s => s.paymentMethod === paymentFilter);
    return result;
  }, [search, paymentFilter, refreshKey]);

  const paymentLabels: Record<string, string> = { cash: 'Cash', mobile_money: 'Mobile Money', card: 'Card', bank_transfer: 'Bank Transfer' };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Sales</h1>
          <p className="text-sm text-gray-500">{sales.length} transactions</p>
        </div>
        <button onClick={() => navigate('/sales/new')} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold px-4 py-2.5 rounded-lg text-sm">
          <Plus size={16} /> New Sale
        </button>
      </div>

      <div className="bg-white rounded-xl border p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by sale ID or staff..." className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" />
          </div>
          <select value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)} className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm">
            <option value="">All Payment Methods</option>
            <option value="cash">Cash</option>
            <option value="mobile_money">Mobile Money</option>
            <option value="card">Card</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Sale ID</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Staff</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Items</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Total</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sales.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-500">No sales recorded</td></tr>
              ) : sales.map(sale => (
                <tr key={sale.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/sales/${sale.id}`)}>
                  <td className="px-4 py-3 font-medium text-gray-800">{sale.saleId}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(sale.date)}</td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{sale.staffName}</td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{sale.items.length} items</td>
                  <td className="px-4 py-3 font-semibold text-gray-800">{formatCurrency(sale.total)}</td>
                  <td className="px-4 py-3 hidden lg:table-cell"><span className="text-xs bg-gray-100 px-2 py-1 rounded">{paymentLabels[sale.paymentMethod]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function SaleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const sale = useMemo(() => id ? saleStorage.getById(id) : null, [id]);

  if (!sale) return (
    <div className="text-center py-12">
      <p className="text-gray-500">Sale not found</p>
      <button onClick={() => navigate('/sales')} className="mt-4 text-amber-600 text-sm font-medium">Back to Sales</button>
    </div>
  );

  const paymentLabels: Record<string, string> = { cash: 'Cash', mobile_money: 'Mobile Money', card: 'Card', bank_transfer: 'Bank Transfer' };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/sales')} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={20} /></button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Sale {sale.saleId}</h1>
          <p className="text-sm text-gray-500">{formatDateTime(sale.date)}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div><span className="text-gray-500">Staff:</span><p className="font-medium">{sale.staffName}</p></div>
          <div><span className="text-gray-500">Payment:</span><p className="font-medium">{paymentLabels[sale.paymentMethod]}</p></div>
          <div><span className="text-gray-500">Status:</span><p className="font-medium text-green-600">{sale.status}</p></div>
          <div><span className="text-gray-500">Items:</span><p className="font-medium">{sale.items.length}</p></div>
        </div>

        <div className="border-t pt-4">
          <table className="w-full text-sm">
            <thead><tr className="border-b"><th className="text-left py-2 font-medium text-gray-600">Product</th><th className="text-right py-2 font-medium text-gray-600">Qty</th><th className="text-right py-2 font-medium text-gray-600">Price</th><th className="text-right py-2 font-medium text-gray-600">Subtotal</th></tr></thead>
            <tbody className="divide-y">
              {sale.items.map((item, i) => (
                <tr key={i}>
                  <td className="py-2">{item.productName}</td>
                  <td className="py-2 text-right">{item.quantity}</td>
                  <td className="py-2 text-right">{formatCurrency(item.unitPrice)}</td>
                  <td className="py-2 text-right font-medium">{formatCurrency(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t pt-4 space-y-1 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatCurrency(sale.subtotal)}</span></div>
          {sale.discount > 0 && <div className="flex justify-between"><span className="text-gray-500">Discount</span><span className="text-red-600">-{formatCurrency(sale.discount)}</span></div>}
          <div className="flex justify-between text-base font-bold pt-2 border-t"><span>Total</span><span className="text-amber-700">{formatCurrency(sale.total)}</span></div>
        </div>
      </div>
    </div>
  );
}
