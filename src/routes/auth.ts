import { Router } from 'express';
import { DatabaseService } from '../database/DatabaseService';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export function createAuthRoutes(dbService: DatabaseService): Router {
  const router = Router();

  // POST /api

/auth/register
  router.post('/register', async (req, res) => {
    try {
      const { email, name, password, role, phone, timezone = 'UTC', locale = 'en' } = req.body;
      
      // Validate input
      if (!email || !name || !password || !role) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Check if user exists
      const existingUser = await dbService.getPrisma().user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(409).json({ error: 'User already exists' });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 12);

      // Create user
      const user = await dbService.getPrisma().user.create({
        data: {
          email,
          name,
          role,
          passwordHash,
          phone,
          timezone,
          locale,
          isActive: true,
          settings: {}
        }
      });

      // Generate JWT
      const token = jwt.sign(
        {

 userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      res.status(201).json({
        message: 'User created successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // POST /api/auth/login
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await dbService.getPrisma().user.findUnique({
        where: { email }
      });

      if (!user || !user.isActive) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Verify password
      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
       

 return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // POST /api/auth/refresh
  router.post('/refresh', async (req, res) => {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(401).json({ error: 'Token required' });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;

      // Generate new token
      const newToken = jwt

.sign(
        { userId: decoded.userId, email: decoded.email, role: decoded.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      res.json({ token: newToken });
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  });

  return router;
}