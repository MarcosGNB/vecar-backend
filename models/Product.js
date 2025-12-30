import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  description: { type: String },
  category: { type: String },
  branches: { type: [String], default: [] },
  promotion: {
    isActive: { type: Boolean, default: false },
    name: { type: String }, // "Black Friday", "Cyber Monday", etc.
    discountedPrice: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date }
  },
  isSoldOut: { type: Boolean, default: false }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual para verificar si la promoción está activa
productSchema.virtual('isPromotionActive').get(function () {
  if (!this.promotion || !this.promotion.isActive) return false;

  const now = new Date();
  const start = new Date(this.promotion.startDate);
  const end = new Date(this.promotion.endDate);

  // Las fechas en la DB están en UTC, pero queremos que se interpreten como hora de Paraguay
  // Paraguay es UTC-3, entonces sumamos 3 horas a la fecha de fin para que termine a las 23:59:59 Paraguay time
  // Ejemplo: 29/11/2025 00:00:00 UTC + 3 horas = 29/11/2025 03:00:00 UTC
  // Esto significa que termina el 29/11/2025 a las 00:00:00 Paraguay time (que es 03:00:00 UTC)
  // Pero queremos que termine a las 23:59:59 Paraguay time, entonces sumamos 1 día completo + 3 horas - 1 segundo
  end.setHours(end.getHours() + 27, 59, 59, 999); // +27 horas = +1 día +3 horas

  return now >= start && now <= end;
});

export const Product = mongoose.model('Product', productSchema);
