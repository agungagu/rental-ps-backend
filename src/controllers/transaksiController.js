import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

const prisma = new PrismaClient();

// Mulai transaksi
export const mulai = async (req, res) => {
  const { nama_pelanggan, playstationId } = req.body;

  try {
    const waktu_mulai = dayjs().tz('Asia/Jakarta').toDate();

    const transaksi = await prisma.transaksi.create({
      data: {
        nama_pelanggan,
        waktu_mulai,
        playstation: { connect: { id: playstationId } }
      }
    });

    await prisma.playstation.update({
      where: { id: playstationId },
      data: { status: 'digunakan' }
    });

    res.json(transaksi);
  } catch (error) {
    res.status(500).json({ message: 'Gagal memulai transaksi', error });
  }
};

// Selesaikan transaksi
export const selesai = async (req, res) => {
  const { id } = req.params;

  try {
    const transaksi = await prisma.transaksi.findUnique({
      where: { id: parseInt(id) },
      include: { playstation: true },
    });

    if (!transaksi || transaksi.status === "selesai") {
      return res.status(404).json({
        message: "Transaksi tidak ditemukan atau sudah selesai"
      });
    }

    const waktu_selesai = dayjs().tz('Asia/Jakarta').toDate();
    const waktu_mulai = dayjs(transaksi.waktu_mulai);
    const durasiJamFloat = dayjs(waktu_selesai).diff(waktu_mulai, 'minute') / 60;
    const durasiJam = parseFloat(durasiJamFloat.toFixed(2));
    const total_harga = Math.ceil(durasiJam * transaksi.playstation.harga);

    const updated = await prisma.transaksi.update({
      where: { id: parseInt(id) },
      data: {
        waktu_selesai,
        durasi: durasiJam,
        total_harga,
        status: 'selesai'
      }
    });

    await prisma.playstation.update({
      where: { id: transaksi.playstationId },
      data: { status: 'tersedia' }
    });

    res.json({ message: 'Transaksi selesai', transaksi: updated });

  } catch (error) {
    return res.status(500).json({
      message: "Gagal menyelesaikan transaksi",
      error: error.message
    });
  }
};

// Get semua transaksi
export const getAll = async (req, res) => {
  const data = await prisma.transaksi.findMany({ include: { playstation: true } });
  res.json(data);
};
