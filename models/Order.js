import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  products: [{    // <-- aquí cambiamos items por products
    productId: String,
    name: String,
    quantity: Number,
    price: Number,
  }],
  total: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, required: true },
  deliveryInfo: {
    type: {
      type: String,
      enum: ['delivery', 'pickup'],
      required: false
    },
    whatsapp: String,
  },
  status: { type: String, default: 'Pendiente' },
}, { timestamps: true });

export const Order = mongoose.model('Order', orderSchema);
