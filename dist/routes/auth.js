"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthRoutes = createAuthRoutes;
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function createAuthRoutes(dbService) {
    const router = (0, express_1.Router)();
    /auth/register;
    router.post('/register', async (req, res) => {
        try {
            const { email, name, password, role, phone, timezone = 'UTC', locale = 'en' } = req.body;
            if (!email || !name || !password || !role) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            const existingUser = await dbService.getPrisma().user.findUnique({
                where: { email }
            });
            if (existingUser) {
                return res.status(409).json({ error: 'User already exists' });
            }
            const passwordHash = await bcrypt_1.default.hash(password, 12);
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
            const user = await prisma.user.create({
                data: {
                    email,
                    name,
                    passwordHash,
                    organizationId: org.id,
                    role,
                    phone,
                    timezone: timezone || 'Africa/Johannesburg',
                    locale: locale || 'en-ZA',
                    isActive: true,
                    settings: {
                        currency: 'ZAR',
                        theme: 'dark'
                    }
                }
            });
            const token = jsonwebtoken_1.default.sign({
                userId: user.id, email: user.email, role: user.role
            }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
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
        }
        catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    router.post('/login', async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await dbService.getPrisma().user.findUnique({
                where: { email }
            });
            if (!user || !user.isActive) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const isValid = await bcrypt_1.default.compare(password, user.passwordHash);
            if (!isValid) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
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
        }
        catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    router.post('/refresh', async (req, res) => {
        try {
            const { token } = req.body;
            if (!token) {
                return res.status(401).json({ error: 'Token required' });
            }
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            const newToken = jsonwebtoken_1.default
                .sign({ userId: decoded.userId, email: decoded.email, role: decoded.role }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
            res.json({ token: newToken });
        }
        catch (error) {
            res.status(401).json({ error: 'Invalid token' });
        }
    });
    return router;
}
//# sourceMappingURL=auth.js.map