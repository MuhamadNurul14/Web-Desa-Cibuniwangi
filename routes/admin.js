const express = require('express');
const router = express.Router();
const upload = require('../config/upload');
const { isAuthenticated, isSuperAdmin } = require('../middleware/auth');

const authController = require('../controllers/authController');
const dashboardController = require('../controllers/dashboardController');
const settingsController = require('../controllers/settingsController');
const userController = require('../controllers/userController');
const crudController = require('../controllers/crudController');
const modules = require('../config/modules');

// ---- AUTH ----
router.get('/login', authController.loginPage);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Everything below requires login
router.use(isAuthenticated);

// ---- DASHBOARD ----
router.get('/dashboard', dashboardController.index);
router.get('/', (req, res) => res.redirect('/admin/dashboard'));

// ---- SETTINGS: PROFILE DESA & KONTAK (singleton) ----
router.get('/profile-desa', settingsController.profileForm);
router.post('/profile-desa', upload.single('logo'), settingsController.profileUpdate);
router.get('/kontak-desa', settingsController.kontakForm);
router.post('/kontak-desa', settingsController.kontakUpdate);

// ---- USER MANAGEMENT (superadmin only) ----
router.get('/users', isSuperAdmin, userController.index);
router.get('/users/create', isSuperAdmin, userController.create);
router.post('/users', isSuperAdmin, userController.store);
router.get('/users/:id/edit', isSuperAdmin, userController.edit);
router.post('/users/:id', isSuperAdmin, userController.update);
router.post('/users/:id/delete', isSuperAdmin, userController.destroy);

// ---- GENERIC CRUD FOR EVERY CONTENT MODULE ----
Object.keys(modules).forEach(moduleKey => {
  const ctrl = crudController(moduleKey);
  const base = `/${moduleKey}`;
  const uploadField = ctrl.cfg.uploadField;
  const uploadMw = uploadField ? upload.single(uploadField) : upload.none();

  router.get(base, ctrl.index);
  router.get(`${base}/create`, ctrl.create);
  router.post(base, uploadMw, ctrl.store);
  router.get(`${base}/:id/edit`, ctrl.edit);
  router.post(`${base}/:id`, uploadMw, ctrl.update);
  router.post(`${base}/:id/delete`, ctrl.destroy);
});

module.exports = router;
