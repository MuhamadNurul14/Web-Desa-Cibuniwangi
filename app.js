require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');

const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');

const app = express();

// ---- View engine ----
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'public/layout'); // default layout, overridden per-route group below

// ---- Middlewares ----
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'cibuniwangi_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 8 } // 8 hours
}));
app.use(flash());

// Make session/flash available to all views
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentPath = req.path;
  next();
});

// ---- Route groups with different layouts ----
app.use('/admin', (req, res, next) => { app.set('layout', 'admin/layout'); next(); }, adminRoutes);
app.use('/', (req, res, next) => { app.set('layout', 'public/layout'); next(); }, publicRoutes);

// ---- 404 handler ----
app.use((req, res) => {
  res.status(404).render('public/404', { title: 'Halaman Tidak Ditemukan', profile: {}, kontakInfo: {} });
});

// ---- Error handler ----
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(`<h1>500 - Terjadi Kesalahan Server</h1><pre>${err.message}</pre>`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Website Desa Cibuniwangi berjalan di http://localhost:${PORT}`);
  console.log(`🔐 Admin Dashboard: http://localhost:${PORT}/admin/login`);
});
// Di bagian akhir file app.js

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// WAJIB: Export app untuk Vercel Serverless Function
module.exports = app;