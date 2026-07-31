const express = require('express');
const router = express.Router();

// Import Controllers
const authController = require('../controllers/authController');
const dashboardController = require('../controllers/dashboardController'); // Pastikan file ini ada!

// Import Middleware
const { isAuthenticated } = require('../middleware/auth');

// --- ROUTES ---
router.get('/login', authController.renderLogin || ((req, res) => res.render('admin/login')));
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Baris yang kemungkinan error di baris 36:
router.get('/dashboard', isAuthenticated, (req, res) => {
  // Pastikan callback-nya adalah fungsi valid
  if (dashboardController && typeof dashboardController.index === 'function') {
    return dashboardController.index(req, res);
  }
  res.render('admin/dashboard', { user: req.session.user });
});

module.exports = router;