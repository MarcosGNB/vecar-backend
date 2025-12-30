import express from 'express';
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart
} from '../controllers/cartController.js';

const router = express.Router();

router.get('/:userId', (req, res, next) => {
  console.log(`🚦 GET /api/cart/${req.params.userId} - Obtener carrito para usuario`);
  next();
}, getCart);

router.post('/add', (req, res, next) => {
  console.log('🚦 POST /api/cart/add - Agregar producto al carrito:', req.body);
  next();
}, addToCart);

router.put('/update', (req, res, next) => {
  console.log('🚦 PUT /api/cart/update - Actualizar cantidad en carrito:', req.body);
  next();
}, updateCartItemQuantity);

router.post('/remove', (req, res, next) => {
  console.log('🚦 POST /api/cart/remove - Eliminar producto del carrito:', req.body);
  next();
}, removeFromCart);

router.delete('/clear/:userId', (req, res, next) => {
  console.log(`🚦 DELETE /api/cart/clear/${req.params.userId} - Vaciar carrito usuario`);
  next();
}, clearCart);

export default router;
