import { v4 as uuidv4 } from 'uuid';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  subcategory: string;
  brand: string;
  description: string;
  vehicleCompatibility: string;
  unitCost: number;
  sellingPrice: number;
  stockQuantity: number;
  minimumStock: number;
  supplier: string;
  location: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  subcategories: string[];
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  location: string;
  productsSupplied: string[];
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'super_admin' | 'inventory_manager' | 'sales_staff' | 'staff';
  status: 'active' | 'inactive';
  lastLogin: string | null;
  createdAt: string;
}

export interface Sale {
  id: string;
  saleId: string;
  date: string;
  staffId: string;
  staffName: string;
  items: { productId: string; productName: string; quantity: number; unitPrice: number; subtotal: number }[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: 'cash' | 'mobile_money' | 'card' | 'bank_transfer';
  status: 'completed' | 'refunded' | 'pending';
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'addition' | 'removal' | 'sale' | 'adjustment';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  userId: string;
  userName: string;
  date: string;
}

export interface Activity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  description: string;
  date: string;
}

export interface Settings {
  storeName: string;
  currency: string;
  currencySymbol: string;
  location: string;
  lowStockThreshold: number;
  taxRate: number;
  demoMode: boolean;
}

const categories: Category[] = [
  { id: 'cat-1', name: 'Oils', description: 'Engine oils, transmission fluids, and lubricants', subcategories: ['Engine Oil', 'Transmission Fluid', 'Brake Fluid', 'Coolant', 'Gear Oil', 'Power Steering Fluid'], createdAt: '2024-01-01T00:00:00Z' },
  { id: 'cat-2', name: 'Filters', description: 'Oil, air, fuel, and cabin filters', subcategories: ['Oil Filter', 'Air Filter', 'Fuel Filter', 'Cabin Filter', 'Transmission Filter'], createdAt: '2024-01-01T00:00:00Z' },
  { id: 'cat-3', name: 'Tyres', description: 'Passenger, SUV, truck, and commercial tyres', subcategories: ['Passenger Tyres', 'SUV Tyres', 'Light Truck Tyres', 'Commercial Tyres'], createdAt: '2024-01-01T00:00:00Z' },
  { id: 'cat-4', name: 'Batteries', description: 'Car, truck, AGM, and maintenance-free batteries', subcategories: ['Car Batteries', 'Truck Batteries', 'AGM Batteries', 'Maintenance-Free Batteries'], createdAt: '2024-01-01T00:00:00Z' },
  { id: 'cat-5', name: 'Accessories', description: 'Spark plugs, wiper blades, brake pads, and more', subcategories: ['Spark Plugs', 'Wiper Blades', 'Brake Pads', 'Bulbs', 'Fuses', 'Air Fresheners', 'Phone Holders', 'Car Chargers', 'Jump Cables', 'Floor Mats', 'Seat Covers', 'Cleaning Products'], createdAt: '2024-01-01T00:00:00Z' },
];

const suppliers: Supplier[] = [
  { id: 'sup-1', name: 'AutoParts Ghana Ltd', contactPerson: 'Kwame Mensah', phone: '+233 24 555 0101', email: 'kwame@autopartsgh.com', location: 'Accra, Ghana', productsSupplied: ['Oils', 'Filters'], status: 'active', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'sup-2', name: 'West Africa Tyres & Rubber', contactPerson: 'Ama Owusu', phone: '+233 20 555 0202', email: 'ama@watyres.com', location: 'Kumasi, Ghana', productsSupplied: ['Tyres'], status: 'active', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'sup-3', name: 'PowerCell Distributors', contactPerson: 'Kofi Asante', phone: '+233 27 555 0303', email: 'kofi@powercell.com', location: 'Tema, Ghana', productsSupplied: ['Batteries'], status: 'active', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'sup-4', name: 'Global Auto Accessories', contactPerson: 'Fatima Ibrahim', phone: '+233 55 555 0404', email: 'fatima@globalaccess.com', location: 'Accra, Ghana', productsSupplied: ['Accessories'], status: 'active', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'sup-5', name: 'TotalEnergies Ghana', contactPerson: 'Yaw Boateng', phone: '+233 30 555 0505', email: 'yaw@totalenergies.com', location: 'Accra, Ghana', productsSupplied: ['Oils'], status: 'active', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'sup-6', name: 'Bosch Automotive Ghana', contactPerson: 'Esi Darko', phone: '+233 24 555 0606', email: 'esi@boschghana.com', location: 'Tema, Ghana', productsSupplied: ['Filters', 'Batteries', 'Accessories'], status: 'active', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'sup-7', name: 'Shell Ghana Limited', contactPerson: 'Nana Agyeman', phone: '+233 20 555 0707', email: 'nana@shellghana.com', location: 'Accra, Ghana', productsSupplied: ['Oils'], status: 'active', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'sup-8', name: 'Michelin West Africa', contactPerson: 'Abena Frimpong', phone: '+233 27 555 0808', email: 'abena@michelinwa.com', location: 'Accra, Ghana', productsSupplied: ['Tyres'], status: 'active', createdAt: '2024-01-01T00:00:00Z' },
];

const users: User[] = [
  { id: 'usr-1', name: 'Lolo Admin', email: 'admin@lolosauto.com', password: 'Admin123!', role: 'super_admin', status: 'active', lastLogin: '2025-01-15T08:30:00Z', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'usr-2', name: 'Kofi Inventory', email: 'inventory@lolosauto.com', password: 'Inventory123!', role: 'inventory_manager', status: 'active', lastLogin: '2025-01-14T14:20:00Z', createdAt: '2024-02-01T00:00:00Z' },
  { id: 'usr-3', name: 'Ama Sales', email: 'sales@lolosauto.com', password: 'Sales123!', role: 'sales_staff', status: 'active', lastLogin: '2025-01-15T09:00:00Z', createdAt: '2024-03-01T00:00:00Z' },
  { id: 'usr-4', name: 'Yaw Staff', email: 'staff@lolosauto.com', password: 'Staff123!', role: 'staff', status: 'active', lastLogin: '2025-01-13T11:45:00Z', createdAt: '2024-04-01T00:00:00Z' },
];

const vehicleTypes = ['Toyota Corolla', 'Toyota Camry', 'Toyota Hilux', 'Honda Civic', 'Honda Accord', 'Hyundai Elantra', 'Hyundai Tucson', 'Kia Rio', 'Kia Sportage', 'Nissan Sentra', 'Nissan Pathfinder', 'Mercedes C-Class', 'BMW 3 Series', 'Ford Ranger', 'Mitsubishi Lancer', 'Suzuki Swift', 'Hyundai Accent', 'Toyota RAV4', 'Honda CR-V', 'Universal'];

const oilBrands = ['Castrol', 'Shell', 'Mobil', 'TotalEnergies', 'Valvoline', 'Liqui Moly', 'Fuchs', 'Motul'];
const filterBrands = ['Bosch', 'MANN-FILTER', 'Fram', 'Mahle', 'K&N', 'Hengst', 'Sofima'];
const tyreBrands = ['Michelin', 'Bridgestone', 'Goodyear', 'Continental', 'Dunlop', 'Pirelli', 'Hankook', 'Yokohama'];
const batteryBrands = ['Bosch', 'Exide', 'Amaron', 'Varta', 'Century', 'Delkor'];
const accessoryBrands = ['NGK', 'Bosch', 'Denso', '3M', 'Meguiars', 'Turtle Wax', 'Osram', 'Philips', 'Baseus', 'Anker'];

function generateProducts(): Product[] {
  const products: Product[] = [];
  let id = 1;

  const addProduct = (
    name: string, category: string, subcategory: string, brand: string,
    vehicleCompat: string, unitCost: number, sellingPrice: number,
    stock: number, minStock: number, supplierId: string, location: string, desc: string
  ) => {
    const sku = `LA-${category.substring(0, 3).toUpperCase()}${String(id).padStart(4, '0')}`;
    const status = stock === 0 ? 'out_of_stock' : stock <= minStock ? 'low_stock' : 'in_stock';
    const createdDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString();
    products.push({
      id: `prod-${id}`,
      sku,
      name,
      category,
      subcategory,
      brand,
      description: desc || `${brand} ${name} - Premium quality automotive ${subcategory.toLowerCase()}`,
      vehicleCompatibility: vehicleCompat,
      unitCost,
      sellingPrice,
      stockQuantity: stock,
      minimumStock: minStock,
      supplier: supplierId,
      location,
      status,
      image: '',
      createdAt: createdDate,
      updatedAt: createdDate,
    });
    id++;
  };

  // OILS - 50+ products
  const oilTypes = [
    { name: 'Engine Oil 5W-30 Fully Synthetic', cost: 85, price: 120 },
    { name: 'Engine Oil 10W-40 Semi Synthetic', cost: 65, price: 95 },
    { name: 'Engine Oil 20W-50 Mineral', cost: 45, price: 70 },
    { name: 'Engine Oil 0W-20 Full Synthetic', cost: 110, price: 155 },
    { name: 'Engine Oil 5W-40 Fully Synthetic', cost: 90, price: 130 },
    { name: 'Engine Oil 15W-40 Diesel', cost: 55, price: 80 },
    { name: 'Transmission Fluid ATF III', cost: 40, price: 65 },
    { name: 'Transmission Fluid CVT', cost: 70, price: 100 },
    { name: 'Brake Fluid DOT 3', cost: 20, price: 35 },
    { name: 'Brake Fluid DOT 4', cost: 25, price: 42 },
    { name: 'Coolant Antifreeze -35°C', cost: 35, price: 55 },
    { name: 'Coolant Long Life Green', cost: 40, price: 60 },
    { name: 'Gear Oil 75W-90', cost: 50, price: 78 },
    { name: 'Gear Oil 80W-90', cost: 42, price: 65 },
    { name: 'Power Steering Fluid', cost: 30, price: 48 },
  ];

  oilTypes.forEach((oil, i) => {
    oilBrands.forEach((brand, j) => {
      if (i * oilBrands.length + j < 60) {
        const stock = Math.floor(Math.random() * 60) + 5;
        const minStock = Math.floor(Math.random() * 10) + 5;
        const vehicle = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
        const shelf = `A${Math.floor(Math.random() * 5) + 1}-${Math.floor(Math.random() * 10) + 1}`;
        addProduct(`${brand} ${oil.name}`, 'Oils', oil.name.split(' ').slice(0, 2).join(' '), brand, vehicle, oil.cost, oil.price, stock, minStock, 'sup-1', shelf, `${brand} ${oil.name} - High performance lubricant for optimal engine protection`);
      }
    });
  });

  // FILTERS - 50+ products
  const filterTypes = [
    { name: 'Oil Filter', cost: 15, price: 28, sub: 'Oil Filter' },
    { name: 'Air Filter Panel', cost: 20, price: 38, sub: 'Air Filter' },
    { name: 'Air Filter Cone', cost: 35, price: 58, sub: 'Air Filter' },
    { name: 'Fuel Filter Inline', cost: 18, price: 32, sub: 'Fuel Filter' },
    { name: 'Fuel Filter Cartridge', cost: 25, price: 45, sub: 'Fuel Filter' },
    { name: 'Cabin Filter Standard', cost: 22, price: 40, sub: 'Cabin Filter' },
    { name: 'Cabin Filter Carbon', cost: 30, price: 52, sub: 'Cabin Filter' },
    { name: 'Transmission Filter Kit', cost: 45, price: 75, sub: 'Transmission Filter' },
  ];

  filterTypes.forEach((filter, i) => {
    filterBrands.forEach((brand, j) => {
      if (i * filterBrands.length + j < 60) {
        const stock = Math.floor(Math.random() * 80) + 10;
        const minStock = Math.floor(Math.random() * 15) + 5;
        const vehicle = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
        const shelf = `B${Math.floor(Math.random() * 5) + 1}-${Math.floor(Math.random() * 10) + 1}`;
        addProduct(`${brand} ${filter.name}`, 'Filters', filter.sub, brand, vehicle, filter.cost, filter.price, stock, minStock, 'sup-6', shelf, `${brand} ${filter.name} - Superior filtration for extended engine life`);
      }
    });
  });

  // TYRES - 45+ products
  const tyreSizes = ['175/65R14', '185/65R15', '195/65R15', '205/55R16', '215/55R17', '225/45R17', '205/60R16', '215/60R17', '225/65R17', '265/65R17', '265/70R16', '215/70R16', '235/60R18', '255/55R19', '275/55R20'];
  const tyreCategories = ['Passenger Tyres', 'Passenger Tyres', 'Passenger Tyres', 'Passenger Tyres', 'Passenger Tyres', 'Passenger Tyres', 'SUV Tyres', 'SUV Tyres', 'SUV Tyres', 'Light Truck Tyres', 'Light Truck Tyres', 'Light Truck Tyres', 'SUV Tyres', 'SUV Tyres', 'Commercial Tyres'];

  tyreSizes.forEach((size, i) => {
    tyreBrands.forEach((brand, j) => {
      if (i * tyreBrands.length + j < 56) {
        const basePrice = 200 + i * 30;
        const stock = Math.floor(Math.random() * 20) + 2;
        const minStock = Math.floor(Math.random() * 5) + 2;
        const vehicle = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
        const shelf = `C${Math.floor(Math.random() * 4) + 1}-${Math.floor(Math.random() * 8) + 1}`;
        addProduct(`${brand} ${size} ${tyreCategories[i]}`, 'Tyres', tyreCategories[i], brand, vehicle, basePrice, basePrice + 80, stock, minStock, 'sup-2', shelf, `${brand} ${size} - Premium ${tyreCategories[i].toLowerCase()} with excellent grip and durability`);
      }
    });
  });

  // BATTERIES - 30+ products
  const batteryTypes = [
    { name: '12V 45Ah Car Battery', cost: 280, price: 420, sub: 'Car Batteries' },
    { name: '12V 55Ah Car Battery', cost: 340, price: 500, sub: 'Car Batteries' },
    { name: '12V 65Ah Car Battery', cost: 400, price: 580, sub: 'Car Batteries' },
    { name: '12V 75Ah Car Battery', cost: 460, price: 660, sub: 'Car Batteries' },
    { name: '12V 100Ah Truck Battery', cost: 550, price: 780, sub: 'Truck Batteries' },
    { name: '12V 120Ah Truck Battery', cost: 650, price: 920, sub: 'Truck Batteries' },
    { name: '12V 60Ah AGM Battery', cost: 500, price: 720, sub: 'AGM Batteries' },
    { name: '12V 70Ah AGM Battery', cost: 580, price: 830, sub: 'AGM Batteries' },
    { name: '12V 50Ah Maintenance-Free', cost: 320, price: 460, sub: 'Maintenance-Free Batteries' },
    { name: '12V 60Ah Maintenance-Free', cost: 380, price: 540, sub: 'Maintenance-Free Batteries' },
  ];

  batteryTypes.forEach((battery, i) => {
    batteryBrands.forEach((brand, j) => {
      if (i * batteryBrands.length + j < 40) {
        const stock = Math.floor(Math.random() * 25) + 3;
        const minStock = Math.floor(Math.random() * 5) + 2;
        const vehicle = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
        const shelf = `D${Math.floor(Math.random() * 3) + 1}-${Math.floor(Math.random() * 6) + 1}`;
        addProduct(`${brand} ${battery.name}`, 'Batteries', battery.sub, brand, vehicle, battery.cost, battery.price, stock, minStock, 'sup-3', shelf, `${brand} ${battery.name} - Reliable starting power with long service life`);
      }
    });
  });

  // ACCESSORIES - 80+ products
  const accessoryTypes = [
    { name: 'Spark Plug Standard', cost: 8, price: 15, sub: 'Spark Plugs', brands: ['NGK', 'Bosch', 'Denso'] },
    { name: 'Spark Plug Iridium', cost: 18, price: 32, sub: 'Spark Plugs', brands: ['NGK', 'Denso'] },
    { name: 'Wiper Blade 18 inch', cost: 12, price: 22, sub: 'Wiper Blades', brands: ['Bosch', '3M'] },
    { name: 'Wiper Blade 20 inch', cost: 14, price: 25, sub: 'Wiper Blades', brands: ['Bosch', '3M'] },
    { name: 'Wiper Blade 22 inch', cost: 15, price: 28, sub: 'Wiper Blades', brands: ['Bosch', '3M'] },
    { name: 'Brake Pad Set Front', cost: 45, price: 78, sub: 'Brake Pads', brands: ['Bosch', 'Denso'] },
    { name: 'Brake Pad Set Rear', cost: 38, price: 65, sub: 'Brake Pads', brands: ['Bosch', 'Denso'] },
    { name: 'Brake Shoe Set', cost: 50, price: 85, sub: 'Brake Pads', brands: ['Bosch'] },
    { name: 'H4 Halogen Bulb', cost: 10, price: 20, sub: 'Bulbs', brands: ['Osram', 'Philips'] },
    { name: 'H7 Halogen Bulb', cost: 12, price: 22, sub: 'Bulbs', brands: ['Osram', 'Philips'] },
    { name: 'LED Headlight Bulb', cost: 35, price: 60, sub: 'Bulbs', brands: ['Osram', 'Philips'] },
    { name: 'Fuse Kit Assorted', cost: 8, price: 15, sub: 'Fuses', brands: ['Bosch'] },
    { name: 'Air Freshener Pine', cost: 5, price: 12, sub: 'Air Fresheners', brands: ['3M'] },
    { name: 'Air Freshener Vanilla', cost: 5, price: 12, sub: 'Air Fresheners', brands: ['3M'] },
    { name: 'Air Freshener Ocean', cost: 5, price: 12, sub: 'Air Fresheners', brands: ['3M'] },
    { name: 'Phone Holder Dashboard', cost: 15, price: 30, sub: 'Phone Holders', brands: ['Baseus', 'Anker'] },
    { name: 'Phone Holder Vent Mount', cost: 12, price: 25, sub: 'Phone Holders', brands: ['Baseus'] },
    { name: 'Car Charger USB-C 30W', cost: 18, price: 35, sub: 'Car Chargers', brands: ['Anker', 'Baseus'] },
    { name: 'Car Charger Dual USB', cost: 12, price: 22, sub: 'Car Chargers', brands: ['Anker'] },
    { name: 'Jump Cables Heavy Duty', cost: 35, price: 65, sub: 'Jump Cables', brands: ['Bosch'] },
    { name: 'Floor Mats Universal', cost: 25, price: 48, sub: 'Floor Mats', brands: ['3M'] },
    { name: 'Floor Mats Custom Fit', cost: 55, price: 95, sub: 'Floor Mats', brands: ['3M'] },
    { name: 'Seat Cover Universal Set', cost: 80, price: 140, sub: 'Seat Covers', brands: ['3M'] },
    { name: 'Car Wash Shampoo', cost: 15, price: 28, sub: 'Cleaning Products', brands: ['Meguiars', 'Turtle Wax'] },
    { name: 'Car Polish Compound', cost: 25, price: 45, sub: 'Cleaning Products', brands: ['Meguiars', 'Turtle Wax'] },
    { name: 'Tire Shine Spray', cost: 12, price: 22, sub: 'Cleaning Products', brands: ['Meguiars'] },
    { name: 'Dashboard Cleaner', cost: 10, price: 20, sub: 'Cleaning Products', brands: ['Turtle Wax'] },
    { name: 'Glass Cleaner', cost: 8, price: 15, sub: 'Cleaning Products', brands: ['3M'] },
  ];

  accessoryTypes.forEach((acc) => {
    acc.brands.forEach((brand) => {
      const stock = Math.floor(Math.random() * 50) + 5;
      const minStock = Math.floor(Math.random() * 10) + 3;
      const vehicle = acc.sub === 'Floor Mats' || acc.sub === 'Seat Covers' ? vehicleTypes[Math.floor(Math.random() * 5)] : 'Universal';
      const shelf = `E${Math.floor(Math.random() * 6) + 1}-${Math.floor(Math.random() * 10) + 1}`;
      addProduct(`${brand} ${acc.name}`, 'Accessories', acc.sub, brand, vehicle, acc.cost, acc.price, stock, minStock, 'sup-4', shelf, `${brand} ${acc.name} - Quality ${acc.sub.toLowerCase()} for your vehicle`);
    });
  });

  return products;
}

function generateSales(): Sale[] {
  const sales: Sale[] = [];
  const staffMembers = [
    { id: 'usr-3', name: 'Ama Sales' },
    { id: 'usr-4', name: 'Yaw Staff' },
  ];
  const paymentMethods: Sale['paymentMethod'][] = ['cash', 'mobile_money', 'card', 'bank_transfer'];

  for (let i = 1; i <= 45; i++) {
    const staff = staffMembers[Math.floor(Math.random() * staffMembers.length)];
    const numItems = Math.floor(Math.random() * 4) + 1;
    const items = [];
    let subtotal = 0;

    for (let j = 0; j < numItems; j++) {
      const unitPrice = Math.floor(Math.random() * 200) + 20;
      const quantity = Math.floor(Math.random() * 5) + 1;
      const itemSubtotal = unitPrice * quantity;
      subtotal += itemSubtotal;
      items.push({
        productId: `prod-${Math.floor(Math.random() * 250) + 1}`,
        productName: `Product ${Math.floor(Math.random() * 250) + 1}`,
        quantity,
        unitPrice,
        subtotal: itemSubtotal,
      });
    }

    const discount = Math.random() > 0.7 ? Math.floor(subtotal * 0.05) : 0;
    const tax = Math.floor((subtotal - discount) * 0.0);
    const total = subtotal - discount + tax;
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    sales.push({
      id: `sale-${i}`,
      saleId: `LS-${String(i).padStart(5, '0')}`,
      date: date.toISOString(),
      staffId: staff.id,
      staffName: staff.name,
      items,
      subtotal,
      discount,
      tax,
      total,
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      status: 'completed',
    });
  }

  return sales;
}

function generateStockMovements(): StockMovement[] {
  const movements: StockMovement[] = [];
  const types: StockMovement['type'][] = ['addition', 'removal', 'sale', 'adjustment'];
  const reasons = ['New shipment received', 'Damaged goods', 'Sale completed', 'Physical inventory count', 'Customer return', 'Transfer from warehouse'];

  for (let i = 1; i <= 60; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const quantity = type === 'addition' ? Math.floor(Math.random() * 50) + 10 : Math.floor(Math.random() * 10) + 1;
    const prevStock = Math.floor(Math.random() * 100) + 20;
    const newStock = type === 'addition' ? prevStock + quantity : prevStock - quantity;
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    movements.push({
      id: `sm-${i}`,
      productId: `prod-${Math.floor(Math.random() * 250) + 1}`,
      productName: `Product ${Math.floor(Math.random() * 250) + 1}`,
      type,
      quantity,
      previousStock: prevStock,
      newStock: Math.max(0, newStock),
      reason: reasons[Math.floor(Math.random() * reasons.length)],
      userId: 'usr-1',
      userName: 'Lolo Admin',
      date: date.toISOString(),
    });
  }

  return movements;
}

function generateActivities(): Activity[] {
  const activities: Activity[] = [];
  const actions = [
    { action: 'stock_added', resource: 'inventory', desc: 'Added stock to' },
    { action: 'sale_recorded', resource: 'sales', desc: 'Recorded sale' },
    { action: 'product_updated', resource: 'inventory', desc: 'Updated product' },
    { action: 'product_created', resource: 'inventory', desc: 'Created new product' },
    { action: 'user_created', resource: 'users', desc: 'Created user account for' },
    { action: 'stock_adjusted', resource: 'inventory', desc: 'Adjusted stock for' },
    { action: 'supplier_added', resource: 'suppliers', desc: 'Added new supplier' },
  ];

  const userNames = ['Lolo Admin', 'Kofi Inventory', 'Ama Sales', 'Yaw Staff'];

  for (let i = 1; i <= 50; i++) {
    const act = actions[Math.floor(Math.random() * actions.length)];
    const user = userNames[Math.floor(Math.random() * userNames.length)];
    const daysAgo = Math.floor(Math.random() * 14);
    const hoursAgo = Math.floor(Math.random() * 24);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(date.getHours() - hoursAgo);

    activities.push({
      id: `act-${i}`,
      userId: `usr-${Math.floor(Math.random() * 4) + 1}`,
      userName: user,
      action: act.action,
      resource: act.resource,
      description: `${act.desc} - ${act.resource} item #${Math.floor(Math.random() * 250) + 1}`,
      date: date.toISOString(),
    });
  }

  return activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

const settings: Settings = {
  storeName: "Lolo's Auto Store",
  currency: 'GHS',
  currencySymbol: 'GHS',
  location: 'Ghana',
  lowStockThreshold: 10,
  taxRate: 0,
  demoMode: true,
};

export const seedData = {
  products: generateProducts(),
  categories,
  suppliers,
  users,
  sales: generateSales(),
  stockMovements: generateStockMovements(),
  activities: generateActivities(),
  settings,
};
