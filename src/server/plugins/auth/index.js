// Auth plugin - minimal authentication module
// Enable by setting config.plugins.auth = true in config/defaults.js

import express from 'express';
import crypto from 'crypto';

const router = express.Router();

// Simple in-memory store for demo (replace with DB in production)
const users = new Map();
const sessions = new Map();

// Generate session token
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Simple password hash (use bcrypt in production)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Routes
router.post('/api/v1/auth/register', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  if (users.has(email)) {
    return res.status(409).json({ error: 'User already exists' });
  }

  const user = {
    id: crypto.randomUUID(),
    email,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  users.set(email, user);

  const token = generateToken();
  sessions.set(token, { userId: user.id, email: user.email });

  res.cookie('session', token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    user: { id: user.id, email: user.email },
    token,
  });
});

router.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.get(email);
  if (!user || user.passwordHash !== hashPassword(password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = generateToken();
  sessions.set(token, { userId: user.id, email: user.email });

  res.cookie('session', token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({ user: { id: user.id, email: user.email }, token });
});

router.post('/api/v1/auth/logout', (req, res) => {
  const token = req.cookies.session;
  if (token) {
    sessions.delete(token);
  }
  res.clearCookie('session');
  res.json({ success: true });
});

router.get('/api/v1/auth/me', (req, res) => {
  const token = req.cookies.session;
  const session = sessions.get(token);

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const user = users.get(session.email);
  res.json({ user: { id: user.id, email: user.email } });
});

export const authPlugin = {
  name: 'auth',
  routes(app) {
    app.use(router);
  },
  // Expose for testing
  _users: users,
  _sessions: sessions,
};

export default authPlugin;
