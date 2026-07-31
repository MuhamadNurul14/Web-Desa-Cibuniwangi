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

// ---- Trust Proxy (Wajib di Vercel/Reverse Proxy) ----
app.set('trust proxy', 1);

// ---- View Engine Setup ----
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'public/layout'); // Default fallback layout

// ---- Body Parsers & Static Files ----
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// Handling Static Files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// ---- Session Configuration ----
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret-key-desa-cibuniwangi',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // Mandatory true on Vercel HTTPS
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 1 Hari
  }
}));

app.use(flash());

// ---- Global Variables & Dynamic Layout Middleware ----
app.use((req, res, next) => {
  res.locals.currentUser = (req.session && req.session.user) ? req.session.user : null;
  res.locals.success = req.flash ? req.flash('success') : [];
  res.locals.error = req.flash ? req.flash('error') : [];
  res.locals.currentPath = req.path;
  next();
});

// ---- Route Groups with Per-Request Layout Isolation ----
// Menggunakan res.locals.layout jauh lebih aman untuk serverless concurrent requests
app.use('/admin', (req, res, next) => {
  res.locals.layout = 'admin/layout';
  next();
}, adminRoutes);

app.use('/', (req, res, next) => {
  res.locals.layout = 'public/layout';
  next();
}, publicRoutes);

// ---- 404 Handler ----
app.use((req, res) => {
  res.status(404).render('public/404', {
    title: 'Halaman Tidak Ditemukan',
    profile: {},
    kontakInfo: {},
    layout: 'public/layout'
  });
});

// ---- Error Handler ----
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(500).send(`
    <div style="padding: 20px; font-family: sans-serif;">
      <h1 style="color: #dc3545;">500 - Terjadi Kesalahan Server</h1>
      <pre style="background: #f8f9fa; padding: 15px; border-radius: 5px; border: 1px solid #ddd;">${err.message || err}</pre>
    </div>
  `);
});

// ---- Local Development Listener ----
// Hanya berjalan jika file ini di-run langsung secara lokal (`node app.js`)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Website Desa Cibuniwangi berjalan di http://localhost:${PORT}`);
    console.log(`🔐 Admin Dashboard: http://localhost:${PORT}/admin/login`);
  });
}

// WAJIB: Export app untuk Vercel Serverless Function
module.exports = app;