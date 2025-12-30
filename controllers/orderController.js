import { Order } from '../models/Order.js';

export const placeOrder = async (req, res) => {
  try {
    console.log('🛒 placeOrder - Datos recibidos:', req.body);

    const newOrder = new Order(req.body);
    await newOrder.save();

    console.log('✅ placeOrder - Orden guardada con éxito:', newOrder);

    res.status(201).json(newOrder);
  } catch (err) {
    console.error('❌ placeOrder - Error al generar orden:', err);
    res.status(500).json({ message: 'Error al generar orden.', error: err.message });
  }
};

export const getOrders = async (req, res) => {
  const { userId } = req.query;
  const filter = userId ? { userId } : {};

  try {
    console.log('📦 getOrders - Filtro:', filter);
    const orders = await Order.find(filter);
    console.log(`✅ getOrders - ${orders.length} órdenes encontradas`);
    res.json(orders);
  } catch (err) {
    console.error('❌ getOrders - Error al obtener órdenes:', err);
    res.status(500).json({ message: 'Error al obtener órdenes.', error: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status, paymentStatus } = req.body;

  try {
    console.log(`🔄 updateOrderStatus - Actualizando orden ${id} con status: ${status}, paymentStatus: ${paymentStatus}`);

    const order = await Order.findById(id);
    if (!order) {
      console.warn(`⚠️ updateOrderStatus - Orden no encontrada: ${id}`);
      return res.status(404).json({ message: 'Orden no encontrada.' });
    }

    order.status = status || order.status;
    order.paymentStatus = paymentStatus || order.paymentStatus;
    await order.save();

    console.log('✅ updateOrderStatus - Orden actualizada:', order);
    res.json(order);
  } catch (err) {
    console.error('❌ updateOrderStatus - Error al actualizar orden:', err);
    res.status(500).json({ message: 'Error al actualizar orden.', error: err.message });
  }
};
