-- CreateEnum
CREATE TYPE "StatusPS" AS ENUM ('tersedia', 'digunakan');

-- CreateEnum
CREATE TYPE "StatusTransaksi" AS ENUM ('berlangsung', 'selesai');

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Playstation" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'tersedia',
    "harga" INTEGER NOT NULL,

    CONSTRAINT "Playstation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaksi" (
    "id" SERIAL NOT NULL,
    "nama_pelanggan" TEXT NOT NULL,
    "waktu_mulai" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "waktu_selesai" TIMESTAMP(3),
    "durasi" INTEGER,
    "total_harga" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'berlangsung',
    "playstationId" INTEGER NOT NULL,

    CONSTRAINT "Transaksi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- AddForeignKey
ALTER TABLE "Transaksi" ADD CONSTRAINT "Transaksi_playstationId_fkey" FOREIGN KEY ("playstationId") REFERENCES "Playstation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
