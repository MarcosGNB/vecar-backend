import { User } from '../models/User.js';

// 👉 Registrar usuario
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ $or: [{ username }, { email }] });
    if (userExists) {
      return res.status(400).json({ message: 'El usuario o correo electrónico ya están registrados.' });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    const userData = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    };

    res.status(201).json(userData);
  } catch (error) {
    console.error('❌ Error al registrar:', error);
    res.status(500).json({ message: 'Error al registrar usuario.' });
  }
};

// 👉 Iniciar sesión
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log('❌ Usuario no encontrado');
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos.' });
    }

    console.log('✅ Usuario encontrado:', user.username);
    console.log('🔍 Métodos disponibles:', Object.getOwnPropertyNames(Object.getPrototypeOf(user)));

    const isMatch = await user.comparePassword(password);
    console.log('🧪 Contraseña coincide:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos.' });
    }

    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    res.status(200).json(userData);
  } catch (error) {
    console.error("❌ Error en loginUser:", error);
    res.status(500).json({ message: 'Error al iniciar sesión.' });
  }
};

// 👉 Obtener todos los usuarios
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener usuarios.' });
  }
};

// 👉 Actualizar usuario
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });

    Object.assign(user, updatedData);
    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar el usuario.' });
  }
};

// 👉 Eliminar usuario
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });

    res.json({ message: 'Usuario eliminado con éxito.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar el usuario.' });
  }
};
