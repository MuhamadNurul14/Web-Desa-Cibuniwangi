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
// Render Halaman Login
router.get('/login', (req, res, next) => {
  if (authController && typeof authController.renderLogin === 'function') {
    return authController.renderLogin(req, res);
  }
  if (authController && typeof authController.loginPage === 'function') {
    return authController.loginPage(req, res);
  }
  res.render('admin/login', { layout: false, title: 'Login Admin' });
});

// Eksekusi Login
router.post('/login', authController.login);
// 3. Process Logout
router.get('/logout', (req, res, next) => {
  if (authController && typeof authController.logout === 'function') {
    return authController.logout(req, res, next);
  }
  req.session.destroy(() => res.redirect('/admin/login'));
});

// 4. Admin Dashboard Page
router.get('/dashboard', checkAuth, (req, res) => {
  if (dashboardController && typeof dashboardController.index === 'function') {
    return dashboardController.index(req, res);
  }
  // Pastikan path render mengarah ke views/admin/dashboard.ejs (atau views/admin/index.ejs)
  res.render('admin/dashboard', { 
    title: 'Dashboard Admin',
    user: req.session ? req.session.user : null 
  });
});

module.exports = router;