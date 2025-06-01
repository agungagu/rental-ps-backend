import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const mulai = async (req, res) => {
  const { nama_pelanggan, playstationId } = req.body;

  try {
    const ps = await prisma.playstation.findUnique({ where: { id: playstationId } });

    if (!ps || ps.status !== 'tersedia') {
      return res.status(400).json({ message: 'Playstation tidak tersedia' });
    }

    const transaksi = await prisma.transaksi.create({
      data: {
        nama_pelanggan,
        playstation: { connect: { id: playstationId } }
      }
    });

    await prisma.playstation.update({
      where: { id: playstationId },
      data: { status: 'digunakan' }
    });

    res.json({ message: 'Transaksi dimulai', transaksi });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal memulai transaksi' });
  }
};

export const selesai = async (req, res) => {
  const { id } = req.params;

  try {
    const transaksi = await prisma.transaksi.findUnique({
      where: { id: parseInt(id) },
      include: { playstation: true }, // ambil data playstation
    });

    if (!transaksi || transaksi.status === "selesai") {
      return res.status(404).json({
        message: "Transaksi tidak ditemukan atau sudah selesai",
      });
    }

    const waktu_selesai = new Date();
    const waktu_mulai = new Date(transaksi.waktu_mulai);

    // Hitung durasi dalam menit, dibulatkan ke atas supaya tetap bayar per menit
    const durasiMenit = Math.ceil((waktu_selesai - waktu_mulai) / (1000 * 60));

    // Harga per menit dihitung dari harga per jam
    const hargaPerMenit = transaksi.playstation.harga / 60;

    // Total harga dihitung sesuai durasi menit * harga per menit
    const total_harga = Math.ceil(durasiMenit * hargaPerMenit);

    const updated = await prisma.transaksi.update({
      where: { id: parseInt(id) },
      data: {
        waktu_selesai,
        durasi: durasiMenit, // durasi dalam menit
        total_harga,
        status: "selesai",
      },
    });

    await prisma.playstation.update({
      where: { id: transaksi.playstationId },
      data: { status: "tersedia" },
    });

    res.json({ message: "Transaksi selesai", transaksi: updated });
  } catch (error) {
    return res.status(500).json({
      message: "Gagal menyelesaikan transaksi",
      error: error.message,
    });
  }
};


export const getAll = async (req, res) => {
  const data = await prisma.transaksi.findMany({ include: { playstation: true } });
  res.json(data);
};
