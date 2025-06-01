// Express app entry point with routing
import express from 'express';
import dotenv from 'dotenv';
import adminRoutes from './routes/adminRoutes.js';
import playstationRoutes from './routes/playstationRoutes.js';
import transaksiRoutes from './routes/transaksiRoutes.js';

dotenv.config();
const app = express();
app.use(express.json());

app.use('/api/admin', adminRoutes);
app.use('/api/playstation', playstationRoutes);
app.use('/api/transaksi', transaksiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));