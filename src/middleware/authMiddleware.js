import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token tidak ditemukan' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('JWT Error:', err.message);
      return res.status(403).json({ error: 'Token tidak valid atau sudah kadaluarsa' });
    }

    req.user = user; // user = { id, username } dari payload token
    next();
  });
}
