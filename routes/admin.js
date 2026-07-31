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
  }const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// ---- Import Controllers ----
let authController, dashboardController;
try { authController = require('../controllers/authController'); } catch (e) { console.warn("authController not loaded", e.message); }
try { dashboardController = require('../controllers/dashboardController'); } catch (e) { console.warn("dashboardController not loaded", e.message); }

// ---- Import Middleware ----
let authMiddleware;
try { authMiddleware = require('../middleware/auth'); } catch (e) { console.warn("authMiddleware not loaded", e.message); }

// Flexible Middleware Resolver (Pencegah crash jika middleware undefined)
const checkAuth = (req, res, next) => {
  if (typeof authMiddleware === 'function') {
    return authMiddleware(req, res, next);
  }
  if (authMiddleware && typeof authMiddleware.isAuthenticated === 'function') {
    return authMiddleware.isAuthenticated(req, res, next);
  }
  // Fallback: Cek session manual
  if (req.session && req.session.user) {
    return next();
  }
  if (req.flash) req.flash('error', 'Silakan login terlebih dahulu.');
  return res.redirect('/admin/login');
};

// ==================================================
// 1. PUBLIC ADMIN ROUTES (Tanpa Login)
// ==================================================

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
router.post('/login', (req, res, next) => {
  if (authController && typeof authController.login === 'function') {
    return authController.login(req, res, next);
  }
  res.redirect('/admin/login');
});

// Logout
router.get('/logout', (req, res, next) => {
  if (authController && typeof authController.logout === 'function') {
    return authController.logout(req, res, next);
  }
  if (req.session) {
    req.session.destroy(() => res.redirect('/admin/login'));
  } else {
    res.redirect('/admin/login');
  }
});

// ==================================================
// 2. PROTECTED ADMIN ROUTES (Wajib Login)
// ==================================================
router.use(checkAuth);

// Root `/admin` -> Redirect otomatis ke `/admin/dashboard`
router.get('/', (req, res) => {
  res.redirect('/admin/dashboard');
});

// Halaman Dashboard Utama
router.get('/dashboard', (req, res, next) => {
  if (dashboardController && typeof dashboardController.index === 'function') {
    return dashboardController.index(req, res, next);
  }
  res.render('admin/dashboard', { 
    title: 'Dashboard Admin',
    user: req.session ? req.session.user : null 
  });
});

// ==================================================
// 3. DYNAMIC ROUTE AUTO-LOADER (Mencegah 404 Semua Menu Admin)
// ==================================================
// Handler ini akan otomatis merender file EJS yang cocok di `views/admin/[page].ejs`
// Contoh: `/admin/struktur_organisasi` -> merender `views/admin/struktur_organisasi.ejs`
router.get('/:page', (req, res, next) => {
  const page = req.params.page;
  const viewPath = path.join(__dirname, '../views/admin', `${page}.ejs`);

  // Cek apakah file template .ejs benar-benar ada di disk
  if (fs.existsSync(viewPath)) {
    return res.render(`admin/${page}`, {
      title: page.replace(/_/g, ' ').toUpperCase(),
      user: req.session ? req.session.user : null
    });
  }

  // Jika file .ejs tidak ditemukan, teruskan ke 404 handler di app.js
  next();
});

module.exports = router;
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