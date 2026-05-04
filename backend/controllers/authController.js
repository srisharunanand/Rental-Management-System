const bcrypt         = require('bcryptjs');
const jwt            = require('jsonwebtoken');
const db             = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

// ── Generate JWT Token ───────────────────
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// ── REGISTER ─────────────────────────────
const register = async (req, res) => {
  try {
    const { full_name, email, password, phone, role } = req.body;

    // Validate fields
    if (!full_name || !email || !password || !role) {
      return sendError(res, 'Please fill all required fields', 400);
    }

    // Check if email already exists
    const [existing] = await db.query(
      'SELECT id FROM users WHERE email = ?', [email]
    );
    if (existing.length > 0) {
      return sendError(res, 'Email already registered', 400);
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await db.query(
      `INSERT INTO users (full_name, email, password_hash, phone, role)
       VALUES (?, ?, ?, ?, ?)`,
      [full_name, email, password_hash, phone, role]
    );

    const userId = result.insertId;

    // If tenant, create tenant profile
    if (role === 'tenant') {
      await db.query(
        'INSERT INTO tenants (user_id) VALUES (?)',
        [userId]
      );
    }

    // Get created user
    const [users] = await db.query(
      'SELECT id, full_name, email, phone, role FROM users WHERE id = ?',
      [userId]
    );

    const user  = users[0];
    const token = generateToken(user);

    return sendSuccess(res, { user, token }, 'Registration successful', 201);

  } catch (err) {
    console.error('Register error:', err.message);
    return sendError(res, 'Registration failed', 500);
  }
};

// ── LOGIN ────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate fields
    if (!email || !password) {
      return sendError(res, 'Please provide email and password', 400);
    }

    // Find user
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?', [email]
    );
    if (users.length === 0) {
      return sendError(res, 'Invalid email or password', 401);
    }

    const user = users[0];

    // Check if active
    if (!user.is_active) {
      return sendError(res, 'Account is deactivated', 401);
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return sendError(res, 'Invalid email or password', 401);
    }

    // Generate token
    const token = generateToken(user);

    // Remove password from response
    delete user.password_hash;

    return sendSuccess(res, { user, token }, 'Login successful');

  } catch (err) {
    console.error('Login error:', err.message);
    return sendError(res, 'Login failed', 500);
  }
};

// ── GET PROFILE ──────────────────────────
const getProfile = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, full_name, email, phone, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return sendError(res, 'User not found', 404);
    }

    return sendSuccess(res, users[0], 'Profile fetched successfully');

  } catch (err) {
    console.error('Get profile error:', err.message);
    return sendError(res, 'Failed to fetch profile', 500);
  }
};

// ── UPDATE PROFILE ───────────────────────
const updateProfile = async (req, res) => {
  try {
    const { full_name, phone, address } = req.body;

    await db.query(
      `UPDATE users SET full_name = ?, phone = ?, address = ?
       WHERE id = ?`,
      [full_name, phone, address, req.user.id]
    );

    return sendSuccess(res, null, 'Profile updated successfully');

  } catch (err) {
    console.error('Update profile error:', err.message);
    return sendError(res, 'Failed to update profile', 500);
  }
};

// ── CHANGE PASSWORD ──────────────────────
const changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    // Get user
    const [users] = await db.query(
      'SELECT * FROM users WHERE id = ?', [req.user.id]
    );
    const user = users[0];

    // Check current password
    const isMatch = await bcrypt.compare(current_password, user.password_hash);
    if (!isMatch) {
      return sendError(res, 'Current password is incorrect', 400);
    }

    // Hash new password
    const password_hash = await bcrypt.hash(new_password, 10);

    // Update password
    await db.query(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [password_hash, req.user.id]
    );

    return sendSuccess(res, null, 'Password changed successfully');

  } catch (err) {
    console.error('Change password error:', err.message);
    return sendError(res, 'Failed to change password', 500);
  }
};

module.exports = { register, login, getProfile, updateProfile, changePassword };