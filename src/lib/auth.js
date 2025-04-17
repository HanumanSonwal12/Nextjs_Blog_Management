import jwt from 'jsonwebtoken';

export function verifyToken(req) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}
