import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();

export const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Cek apakah username sudah ada
    const existing = await prisma.admin.findUnique({ where: { username } });
    if (existing) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const admin = await prisma.admin.create({
      data: { username, password: hashed },
    });
     // Generate JWT after successful registration
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );


    return res.status(201).json({ message: 'Registrasi berhasil', admin, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Terjadi kesalahan saat registrasi' });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await prisma.admin.findUnique({ where: { username } });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ error: 'Username atau password salah' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Terjadi kesalahan saat login' });
  }
};
