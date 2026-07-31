const express = require('express');
const router = express.Router();

// Import Controllers
const authController = require('../controllers/authController');
const dashboardController = require('../controllers/dashboardController');

// Import Middleware
const authMiddleware = require('../middleware/auth');

// Flexible middleware resolver (mencegah crash undefined)
const checkAuth = (req, res, next) => {
  if (typeof authMiddleware === 'function') {
    return authMiddleware(req, res, next);
  }
  if (authMiddleware && typeof authMiddleware.isAuthenticated === 'function') {
    return authMiddleware.isAuthenticated(req, res, next);
  }
  // Fallback jika middleware gagal ter-load: cek session manual
  if (req.session && req.session.user) {
    return next();
  }
  return res.redirect('/admin/login');
};

// --- ROUTES ---

// 1. Render Login Page
router.get('/login', (req, res) => {
  if (authController && typeof authController.renderLogin === 'function') {
    return authController.renderLogin(req, res);
  }
  res.render('admin/login');
});

// 2. Process Login
router.post('/login', (req, res, next) => {
  if (authController && typeof authController.login === 'function') {
    return authController.login(req, res, next);
  }
  res.status(500).send("Auth controller login function missing");
});

// 3. Process Logout
router.get('/logout', (req, res, next) => {
  if (authController && typeof authController.logout === 'function') {
    return authController.logout(req, res, next);
  }
  req.session.destroy(() => res.redirect('/admin/login'));
});

// 4. Admin Dashboard Page
router.get('/dashboard', checkAuth, (req, res, next) => {
  if (dashboardController && typeof dashboardController.index === 'function') {
    return dashboardController.index(req, res, next);
  }
  if (dashboardController && typeof dashboardController.dashboard === 'function') {
    return dashboardController.dashboard(req, res, next);
  }
  res.render('admin/dashboard', { user: req.session ? req.session.user : null });
});

module.exports = router;