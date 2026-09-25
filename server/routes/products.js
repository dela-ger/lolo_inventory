/**
 * Products/Inventory Routes
 * 
 * Future implementation:
 * - GET /api/products - List all products (with pagination, search, filters)
 * - GET /api/products/:id - Get single product
 * - POST /api/products - Create product
 * - PUT /api/products/:id - Update product
 * - DELETE /api/products/:id - Delete product
 * - POST /api/products/:id/stock - Adjust stock
 * - GET /api/products/:id/movements - Get stock movement history
 * - GET /api/products/low-stock - Get low stock items
 * - GET /api/products/out-of-stock - Get out of stock items
 * 
 * Query parameters for GET /api/products:
 * - search: string (searches name, SKU, brand, category)
 * - category: string (filter by category)
 * - status: in_stock | low_stock | out_of_stock
 * - brand: string
 * - supplier: string
 * - sortBy: name | stock | price | category | date
 * - sortDir: asc | desc
 * - page: number
 * - limit: number
 */

// const express = require('express');
// const router = express.Router();
// const productController = require('../controllers/productController');
// const authMiddleware = require('../middleware/auth');
// const permissionMiddleware = require('../middleware/permissions');

// router.get('/', authMiddleware, productController.getAll);
// router.get('/low-stock', authMiddleware, productController.getLowStock);
// router.get('/out-of-stock', authMiddleware, productController.getOutOfStock);
// router.get('/:id', authMiddleware, productController.getById);
// router.post('/', authMiddleware, permissionMiddleware('inventory_create'), productController.create);
// router.put('/:id', authMiddleware, permissionMiddleware('inventory_edit'), productController.update);
// router.delete('/:id', authMiddleware, permissionMiddleware('inventory_delete'), productController.delete);
// router.post('/:id/stock', authMiddleware, permissionMiddleware('inventory_adjust'), productController.adjustStock);
// router.get('/:id/movements', authMiddleware, productController.getStockMovements);

// module.exports = router;

export default {};
