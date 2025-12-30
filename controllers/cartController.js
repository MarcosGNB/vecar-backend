import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';

// 👉 Obtener el carrito del usuario
export const getCart = async (req, res) => {
  try {
    console.log('🔍 Buscando carrito del usuario:', req.params.userId);
    const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.product');
    if (!cart) {
      console.log('🛒 Carrito no encontrado, devolviendo lista vacía');
      return res.json([]);
    }

    const formattedItems = cart.items.map(item => ({
      _id: item.product._id,
      name: item.product.name,
      image: item.product.image,
      price: item.product.price,
      promotion: item.product.promotion, // Incluir datos de promoción
      quantity: item.quantity,
    }));

    res.json(formattedItems);
  } catch (err) {
    console.error('❌ Error al obtener el carrito:', err);
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
};

// 👉 Agregar producto al carrito
export const addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;
  console.log('🛒 Intentando agregar al carrito:', { userId, productId, quantity });

  if (!userId || !productId || !quantity) {
    console.log('❌ Falta userId, productId o quantity');
    return res.status(400).json({ error: 'Faltan datos necesarios para agregar al carrito' });
  }

  try {
    let cart = await Cart.findOne({ userId });
    console.log('🧾 Carrito existente:', cart ? 'Sí' : 'No');

    if (!cart) {
      cart = new Cart({ userId, items: [{ product: productId, quantity }] });
      console.log('➕ Creando nuevo carrito para el usuario');
    } else {
      const index = cart.items.findIndex(item => item.product.toString() === productId);
      if (index > -1) {
        cart.items[index].quantity += quantity;
        console.log(`🔄 Producto ya existe, nueva cantidad: ${cart.items[index].quantity}`);
      } else {
        cart.items.push({ product: productId, quantity });
        console.log('🆕 Producto agregado al carrito');
      }
    }

    await cart.save();
    console.log('💾 Carrito guardado exitosamente');

    const populated = await cart.populate('items.product');
    const formattedItems = populated.items.map(item => ({
      _id: item.product._id,
      name: item.product.name,
      image: item.product.image,
      price: item.product.price,
      promotion: item.product.promotion, // Incluir datos de promoción
      quantity: item.quantity,
    }));

    res.json(formattedItems);
  } catch (err) {
    console.error('❌ Error al agregar al carrito:', err);
    res.status(500).json({ error: 'Error al agregar al carrito' });
  }
};

// 👉 Actualizar cantidad de un producto
export const updateCartItemQuantity = async (req, res) => {
  const { userId, productId, quantity } = req.body;
  console.log('✏️ Actualizando cantidad:', { userId, productId, quantity });

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    const item = cart.items.find(item => item.product.toString() === productId);
    if (item) {
      item.quantity = quantity;
      console.log('✅ Cantidad actualizada');
    }

    await cart.save();
    const populated = await cart.populate('items.product');
    const formattedItems = populated.items.map(item => ({
      _id: item.product._id,
      name: item.product.name,
      image: item.product.image,
      price: item.product.price,
      promotion: item.product.promotion, // Incluir datos de promoción
      quantity: item.quantity,
    }));

    res.json(formattedItems);
  } catch (err) {
    console.error('❌ Error al actualizar cantidad:', err);
    res.status(500).json({ error: 'Error al actualizar cantidad' });
  }
};

// 👉 Eliminar un producto del carrito
export const removeFromCart = async (req, res) => {
  const { userId, productId } = req.body;
  console.log('🗑️ Eliminando producto del carrito:', { userId, productId });

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();
    const populated = await cart.populate('items.product');
    const formattedItems = populated.items.map(item => ({
      _id: item.product._id,
      name: item.product.name,
      image: item.product.image,
      price: item.product.price,
      promotion: item.product.promotion, // Incluir datos de promoción
      quantity: item.quantity,
    }));

    res.json(formattedItems);
  } catch (err) {
    console.error('❌ Error al eliminar del carrito:', err);
    res.status(500).json({ error: 'Error al eliminar del carrito' });
  }
};

// 👉 Vaciar el carrito
export const clearCart = async (req, res) => {
  try {
    console.log('🧹 Vaciando carrito del usuario:', req.params.userId);
    await Cart.findOneAndDelete({ userId: req.params.userId });
    res.json({ message: 'Carrito vaciado' });
  } catch (err) {
    console.error('❌ Error al vaciar el carrito:', err);
    res.status(500).json({ error: 'Error al vaciar el carrito' });
  }
};
