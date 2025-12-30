import mongoose from 'mongoose';
import { Product } from '../models/Product.js';

export const getProducts = async (req, res) => {
  try {
    let query = {};
    const { branch } = req.query;
    if (branch && branch !== 'todas') {
      query.branches = branch;
    }
    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener productos.', error: err });
  }
};

export const addProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: 'Error al agregar producto.', error: err });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID de producto inválido.' });
  }

  try {
    const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar producto.', error: err });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID de producto inválido.' });
  }

  try {
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }
    res.json({ message: 'Producto eliminado con éxito.' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar producto.', error: err });
  }
};
