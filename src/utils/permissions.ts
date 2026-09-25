export type Permission =
  | 'inventory_view'
  | 'inventory_create'
  | 'inventory_edit'
  | 'inventory_delete'
  | 'inventory_adjust'
  | 'sales_create'
  | 'sales_view'
  | 'reports_view'
  | 'users_view'
  | 'users_manage'
  | 'suppliers_manage'
  | 'categories_manage'
  | 'settings_manage'
  | 'activity_view';

export type Role = 'super_admin' | 'inventory_manager' | 'sales_staff' | 'staff';

export const rolePermissions: Record<Role, Permission[]> = {
  super_admin: [
    'inventory_view', 'inventory_create', 'inventory_edit', 'inventory_delete', 'inventory_adjust',
    'sales_create', 'sales_view', 'reports_view', 'users_view', 'users_manage',
    'suppliers_manage', 'categories_manage', 'settings_manage', 'activity_view',
  ],
  inventory_manager: [
    'inventory_view', 'inventory_create', 'inventory_edit', 'inventory_adjust',
    'sales_view', 'reports_view', 'suppliers_manage', 'activity_view',
  ],
  sales_staff: [
    'inventory_view', 'sales_create', 'sales_view',
  ],
  staff: [
    'inventory_view', 'sales_view',
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}

export function canAccessPage(role: Role, page: string): boolean {
  const pagePermissions: Record<string, Permission[]> = {
    dashboard: ['inventory_view'],
    inventory: ['inventory_view'],
    'inventory-new': ['inventory_create'],
    'inventory-edit': ['inventory_edit'],
    sales: ['sales_view'],
    'sales-new': ['sales_create'],
    suppliers: ['suppliers_manage'],
    categories: ['categories_manage'],
    reports: ['reports_view'],
    users: ['users_manage'],
    activity: ['activity_view'],
    settings: ['settings_manage'],
  };
  const required = pagePermissions[page];
  if (!required) return false;
  return required.some(p => hasPermission(role, p));
}

export const roleLabels: Record<Role, string> = {
  super_admin: 'Super Admin',
  inventory_manager: 'Inventory Manager',
  sales_staff: 'Sales Staff',
  staff: 'Staff',
};
