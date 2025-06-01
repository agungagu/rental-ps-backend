// CRUD logic for playstation with Prisma here
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAll = async (req, res) => {
  const data = await prisma.playstation.findMany();
  res.json(data);
};

export const create = async (req, res) => {
  const { nama, harga } = req.body;
  try {
    const ps = await prisma.playstation.create({
      data: {
        nama,
        harga: parseInt(harga),
        status: "tersedia"
      }
    })

    return res.status(201).json(ps)
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Gagal membuat data playstation"
    })
  }
};

export const update = async (req, res) => {
  const { id } = req.params;
  const { nama, status } = req.body;
  const ps = await prisma.playstation.update({ where: { id: parseInt(id) }, data: { nama, status } });
  res.json(ps);
};

export const remove = async (req, res) => {
  const { id } = req.params;
  await prisma.playstation.delete({ where: { id: parseInt(id) } });
  res.json({ message: 'Deleted' });
};
