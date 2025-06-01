# Rental PS Backend

Backend aplikasi rental Playstation menggunakan **Express.js**, **Prisma ORM** dengan **PostgreSQL**,
lengkap dengan fitur autentikasi JWT, CRUD PlayStation, dan transaksi start/stop dengan perhitungan harga otomatis.

---

## Fitur

- Register & Login Admin dengan JWT Authentication
- CRUD PlayStation dengan harga sewa per jam yang bisa diatur
- Transaksi mulai dan selesai dengan perhitungan durasi dan total harga secara otomatis
- Middleware autentikasi untuk proteksi endpoint
- Struktur kode modular dan mudah dikembangkan

---

## Teknologi

- Node.js & Express.js
- Prisma ORM + PostgreSQL
- JWT untuk autentikasi
- bcrypt untuk hashing password

---

## Persiapan

Pastikan kamu sudah menginstall:

- [Node.js](https://nodejs.org/) v16+
- PostgreSQL sudah berjalan dan buat database baru
- Git

---

## Cara Clone & Setup

```bash
# Clone repository
git clone https://github.com/agungagu/rental-ps-backend.git
cd rental-ps-backend

# Install dependencies
npm install

# Buat file .env di root project dengan isi contoh:
# DATABASE_URL="postgresql://username:password@localhost:5432/nama_database?schema=public"
# JWT_SECRET="rahasia_super_secret"

# Jalankan migrasi Prisma untuk membuat schema DB
npx prisma migrate dev --name init

# Jalankan server
npm run dev
