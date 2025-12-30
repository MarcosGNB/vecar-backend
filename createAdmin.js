import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User.js'; // Ajusta la ruta si tu carpeta models está en otro lado

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🌐 Conectado a MongoDB');

    // Buscar si ya existe un admin con username 'vecaradmin'
    const adminExists = await User.findOne({ username: 'vecaradmin' });
    if (adminExists) {
      console.log('⚠️ El usuario vecaradmin ya existe');
      return mongoose.disconnect();
    }

    // Crear usuario admin con contraseña 'vecar2026'
    const adminUser = new User({
      username: 'vecaradmin',
      email: 'vecarcubiertas@gmail.com',
      password: 'vecar2026',
      role: 'admin',
    });

    await adminUser.save();
    console.log('✅ Usuario vecaradmin creado correctamente');
  } catch (error) {
    console.error('❌ Error creando usuario admin:', error);
  } finally {
    mongoose.disconnect();
  }
}

createAdmin();
