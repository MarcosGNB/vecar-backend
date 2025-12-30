import express from 'express';
import {
  placeOrder,
  getOrders,
  updateOrderStatus
} from '../controllers/orderController.js';

const router = express.Router();

router.post('/', placeOrder);          // Crear orden
router.get('/', getOrders);            // Listar órdenes (con filtro opcional userId)
router.put('/:id', updateOrderStatus); // Actualizar estado de orden

export default router;
