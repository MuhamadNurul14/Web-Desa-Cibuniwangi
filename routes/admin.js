const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// ---- Import Controllers ----
let authController, dashboardController;
try { authController = require('../controllers/authController'); } catch (e) {}
try { dashboardController = require('../controllers/dashboardController'); } catch (e) {}

// ---- Middleware Auth Check ----
const checkAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  
  if (req.flash) req.flash('error', 'Sesi telah berakhir, silakan login kembali.');
  return res.redirect('/admin/login');
};

// ==================================================
// 1. PUBLIC ROUTES (Login / Logout)
// ==================================================
router.get('/login', (req, res) => {
  if (req.session && req.session.user) {
    return res.redirect('/admin/dashboard');
  }
  
  if (authController && typeof authController.renderLogin === 'function') {
    return authController.renderLogin(req, res);
  }
  res.render('admin/login', { layout: false, title: 'Login Admin' });
});

router.post('/login', (req, res, next) => {
  if (authController && typeof authController.login === 'function') {
    return authController.login(req, res, next);
  }
  res.redirect('/admin/login');
});

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(() => res.redirect('/admin/login'));
  } else {
    res.redirect('/admin/login');
  }
});

// ==================================================
// 2. PROTECTED ROUTES (Wajib Login)
// ==================================================
router.use(checkAuth);

router.get('/', (req, res) => res.redirect('/admin/dashboard'));

router.get('/dashboard', (req, res, next) => {
  if (dashboardController && typeof dashboardController.index === 'function') {
    return dashboardController.index(req, res, next);
  }
  res.render('admin/dashboard', {
    title: 'Dashboard Admin',
    user: req.session.user
  });
});

// ==================================================
// 3. SETTINGS ROUTES (admin/settings/...)
// ==================================================
router.get('/settings/profile', (req, res) => {
  res.render('admin/settings/profile', { 
    title: 'Profil Admin', 
    user: req.session.user 
  });
});

router.get('/settings/kontak', (req, res) => {
  res.render('admin/settings/kontak', { 
    title: 'Pengaturan Kontak', 
    user: req.session.user 
  });
});

// ==================================================
// 4. USERS MANAGEMENT (admin/users/...)
// ==================================================
router.get('/users', (req, res) => {
  res.render('admin/users/index', { 
    title: 'Kelola Pengguna', 
    user: req.session.user, 
    data: [] 
  });
});

// ==================================================
// 5. DYNAMIC CRUD ROUTE (Mengarahkan ke admin/crud/index.ejs)
// ==================================================
router.get('/:page', (req, res, next) => {
  const page = req.params.page;

  // 1. Cek apakah ada file spesifik langsung di views/admin/ (misal: coming-soon.ejs)
  const rootFile = path.join(__dirname, '../views/admin', `${page}.ejs`);
  if (fs.existsSync(rootFile)) {
    return res.render(`admin/${page}`, {
      title: page.replace(/_/g, ' ').toUpperCase(),
      user: req.session.user
    });
  }

  // 2. Jika tidak ada file khusus, Render via Template Terpusat `admin/crud/index`
  return res.render('admin/crud/index', {
    title: page.replace(/_/g, ' ').toUpperCase(),
    user: req.session.user,
    activePage: page,
    items: [], 
    fields: []
  });
});

module.exports = router;