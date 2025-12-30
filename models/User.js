import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

// 🔐 Hashear la contraseña antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('🔐 Contraseña hasheada:', this.password);  // Log para verificar
    next();
  } catch (err) {
    next(err);
  }
});

// ✅ Método para comparar contraseñas al hacer login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', userSchema);
