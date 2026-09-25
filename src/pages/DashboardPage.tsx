import React, { useMemo } from 'react';
import { productStorage, saleStorage, activityStorage, stockMovementStorage } from '../services/storage';
import { formatCurrency, formatDate, formatRelativeTime } from '../utils/helpers';
import { Package, TrendingUp, AlertTriangle, XCircle, ShoppingCart, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444'];

export default function DashboardPage() {
  const data = useMemo(() => {
    const products = productStorage.getAll();
    const sales = saleStorage.getAll();
    const activities = activityStorage.getAll();
    const movements = stockMovementStorage.getAll();

    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.stockQuantity, 0);
    const lowStock = products.filter(p => p.status === 'low_stock').length;
    const outOfStock = products.filter(p => p.status === 'out_of_stock').length;
    const inventoryValue = products.reduce((sum, p) => sum + (p.stockQuantity * p.unitCost), 0);

    const today = new Date().toDateString();
    const todaySales = sales.filter(s => new Date(s.date).toDateString() === today);
    const todaySalesTotal = todaySales.reduce((sum, s) => sum + s.total, 0);

    const last7Days = sales.filter(s => {
      const d = new Date(s.date);
      const diff = (Date.now() - d.getTime()) / 86400000;
      return diff <= 7;
    });
    const last7DaysTotal = last7Days.reduce((sum, s) => sum + s.total, 0);

    const last30Days = sales.filter(s => {
      const d = new Date(s.date);
      const diff = (Date.now() - d.getTime()) / 86400000;
      return diff <= 30;
    });
    const last30DaysTotal = last30Days.reduce((sum, s) => sum + s.total, 0);

    // Category distribution
    const categoryData = products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const categoryChart = Object.entries(categoryData).map(([name, value]) => ({ name, value }));

    // Stock movements summary
    const additions = movements.filter(m => m.type === 'addition').reduce((sum, m) => sum + m.quantity, 0);
    const removals = movements.filter(m => m.type === 'removal').reduce((sum, m) => sum + m.quantity, 0);
    const sold = movements.filter(m => m.type === 'sale').reduce((sum, m) => sum + m.quantity, 0);

    // Low stock items
    const lowStockItems = products.filter(p => p.status === 'low_stock' || p.status === 'out_of_stock').slice(0, 8);

    // Recent activities
    const recentActivities = activities.slice(0, 8);

    return {
      totalProducts, totalStock, lowStock, outOfStock, inventoryValue,
      todaySalesTotal, last7DaysTotal, last30DaysTotal,
      categoryChart, additions, removals, sold, lowStockItems, recentActivities,
    };
  }, []);

  const stats = [
    { label: 'Total Products', value: data.totalProducts.toString(), icon: Package, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Stock Units', value: data.totalStock.toLocaleString(), icon: TrendingUp, color: 'bg-green-50 text-green-600' },
    { label: 'Low Stock Items', value: data.lowStock.toString(), icon: AlertTriangle, color: 'bg-amber-50 text-amber-600' },
    { label: 'Out of Stock', value: data.outOfStock.toString(), icon: XCircle, color: 'bg-red-50 text-red-600' },
    { label: "Today's Sales", value: formatCurrency(data.todaySalesTotal), icon: ShoppingCart, color: 'bg-purple-50 text-purple-600' },
    { label: 'Inventory Value', value: formatCurrency(data.inventoryValue), icon: DollarSign, color: 'bg-emerald-50 text-emerald-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your store inventory and sales</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
                <p className="text-xl md:text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sales Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs font-medium text-gray-500 uppercase">Today</p>
          <p className="text-lg font-bold text-gray-800 mt-1">{formatCurrency(data.todaySalesTotal)}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs font-medium text-gray-500 uppercase">Last 7 Days</p>
          <p className="text-lg font-bold text-gray-800 mt-1">{formatCurrency(data.last7DaysTotal)}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs font-medium text-gray-500 uppercase">Last 30 Days</p>
          <p className="text-lg font-bold text-gray-800 mt-1">{formatCurrency(data.last30DaysTotal)}</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-white rounded-xl border p-4 md:p-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Inventory by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.categoryChart} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {data.categoryChart.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stock Movement */}
        <div className="bg-white rounded-xl border p-4 md:p-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Stock Movement Summary</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Added', value: data.additions, fill: '#10b981' },
                { name: 'Sold', value: data.sold, fill: '#3b82f6' },
                { name: 'Removed', value: data.removals, fill: '#ef4444' },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Items */}
        <div className="bg-white rounded-xl border p-4 md:p-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Low Stock Alerts</h3>
          {data.lowStockItems.length === 0 ? (
            <p className="text-sm text-gray-500">All items are well-stocked!</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {data.lowStockItems.map(item => (
                <div key={item.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.sku} • Min: {item.minimumStock}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    item.status === 'out_of_stock' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {item.stockQuantity} units
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border p-4 md:p-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Recent Activity</h3>
          {data.recentActivities.length === 0 ? (
            <p className="text-sm text-gray-500">No recent activity</p>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {data.recentActivities.map(act => (
                <div key={act.id} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    act.action.includes('stock') ? 'bg-green-500' :
                    act.action.includes('sale') ? 'bg-blue-500' :
                    act.action.includes('product') ? 'bg-purple-500' : 'bg-gray-400'
                  }`} />
                  <div className="min-w-0">
                    <p className="text-sm text-gray-800 truncate">{act.description}</p>
                    <p className="text-xs text-gray-500">{act.userName} • {formatRelativeTime(act.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
