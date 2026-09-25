import { Product, Category, Supplier, User, Sale, StockMovement, Activity, Settings } from '../../data/seedData';

const KEYS = {
  products: 'lolos_auto_products',
  users: 'lolos_auto_users',
  categories: 'lolos_auto_categories',
  suppliers: 'lolos_auto_suppliers',
  sales: 'lolos_auto_sales',
  stockMovements: 'lolos_auto_stock_movements',
  activities: 'lolos_auto_activity',
  settings: 'lolos_auto_settings',
  initialized: 'lolos_auto_initialized',
  session: 'lolos_auto_session',
};

function get<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

function set<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

function getOne<T>(key: string): T | null {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

function setOne<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// Products
export const productStorage = {
  getAll: (): Product[] => get<Product>(KEYS.products),
  getById: (id: string): Product | undefined => get<Product>(KEYS.products).find(p => p.id === id),
  create: (product: Product): void => { const all = get<Product>(KEYS.products); all.push(product); set(KEYS.products, all); },
  update: (id: string, updates: Partial<Product>): void => { const all = get<Product>(KEYS.products); const idx = all.findIndex(p => p.id === id); if (idx !== -1) { all[idx] = { ...all[idx], ...updates, updatedAt: new Date().toISOString() }; set(KEYS.products, all); } },
  delete: (id: string): void => { const all = get<Product>(KEYS.products).filter(p => p.id !== id); set(KEYS.products, all); },
  isSkuUnique: (sku: string, excludeId?: string): boolean => { const all = get<Product>(KEYS.products); return !all.some(p => p.sku === sku && p.id !== excludeId); },
};

// Users
export const userStorage = {
  getAll: (): User[] => get<User>(KEYS.users),
  getById: (id: string): User | undefined => get<User>(KEYS.users).find(u => u.id === id),
  getByEmail: (email: string): User | undefined => get<User>(KEYS.users).find(u => u.email === email),
  create: (user: User): void => { const all = get<User>(KEYS.users); all.push(user); set(KEYS.users, all); },
  update: (id: string, updates: Partial<User>): void => { const all = get<User>(KEYS.users); const idx = all.findIndex(u => u.id === id); if (idx !== -1) { all[idx] = { ...all[idx], ...updates }; set(KEYS.users, all); } },
  delete: (id: string): void => { const all = get<User>(KEYS.users).filter(u => u.id !== id); set(KEYS.users, all); },
};

// Categories
export const categoryStorage = {
  getAll: (): Category[] => get<Category>(KEYS.categories),
  getById: (id: string): Category | undefined => get<Category>(KEYS.categories).find(c => c.id === id),
  create: (category: Category): void => { const all = get<Category>(KEYS.categories); all.push(category); set(KEYS.categories, all); },
  update: (id: string, updates: Partial<Category>): void => { const all = get<Category>(KEYS.categories); const idx = all.findIndex(c => c.id === id); if (idx !== -1) { all[idx] = { ...all[idx], ...updates }; set(KEYS.categories, all); } },
  delete: (id: string): void => { const all = get<Category>(KEYS.categories).filter(c => c.id !== id); set(KEYS.categories, all); },
};

// Suppliers
export const supplierStorage = {
  getAll: (): Supplier[] => get<Supplier>(KEYS.suppliers),
  getById: (id: string): Supplier | undefined => get<Supplier>(KEYS.suppliers).find(s => s.id === id),
  create: (supplier: Supplier): void => { const all = get<Supplier>(KEYS.suppliers); all.push(supplier); set(KEYS.suppliers, all); },
  update: (id: string, updates: Partial<Supplier>): void => { const all = get<Supplier>(KEYS.suppliers); const idx = all.findIndex(s => s.id === id); if (idx !== -1) { all[idx] = { ...all[idx], ...updates }; set(KEYS.suppliers, all); } },
  delete: (id: string): void => { const all = get<Supplier>(KEYS.suppliers).filter(s => s.id !== id); set(KEYS.suppliers, all); },
};

// Sales
export const saleStorage = {
  getAll: (): Sale[] => get<Sale>(KEYS.sales),
  getById: (id: string): Sale | undefined => get<Sale>(KEYS.sales).find(s => s.id === id),
  create: (sale: Sale): void => { const all = get<Sale>(KEYS.sales); all.push(sale); set(KEYS.sales, all); },
  update: (id: string, updates: Partial<Sale>): void => { const all = get<Sale>(KEYS.sales); const idx = all.findIndex(s => s.id === id); if (idx !== -1) { all[idx] = { ...all[idx], ...updates }; set(KEYS.sales, all); } },
};

// Stock Movements
export const stockMovementStorage = {
  getAll: (): StockMovement[] => get<StockMovement>(KEYS.stockMovements),
  create: (movement: StockMovement): void => { const all = get<StockMovement>(KEYS.stockMovements); all.push(movement); set(KEYS.stockMovements, all); },
};

// Activities
export const activityStorage = {
  getAll: (): Activity[] => get<Activity>(KEYS.activities),
  create: (activity: Activity): void => { const all = get<Activity>(KEYS.activities); all.unshift(activity); set(KEYS.activities, all); },
};

// Settings
export const settingsStorage = {
  get: (): Settings | null => getOne<Settings>(KEYS.settings),
  set: (settings: Settings): void => setOne(KEYS.settings, settings),
};

// Session
export const sessionStorage = {
  get: (): User | null => getOne<User>(KEYS.session),
  set: (user: User): void => setOne(KEYS.session, user),
  clear: (): void => localStorage.removeItem(KEYS.session),
};

// Initialization
export const initStorage = {
  isInitialized: (): boolean => localStorage.getItem(KEYS.initialized) === 'true',
  setInitialized: (): void => localStorage.setItem(KEYS.initialized, 'true'),
  reset: (): void => {
    Object.values(KEYS).forEach(key => localStorage.removeItem(key));
  },
};
