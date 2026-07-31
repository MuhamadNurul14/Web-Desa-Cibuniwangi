const bcrypt = require('bcryptjs');
const GenericModel = require('../models/GenericModel');
const Users = new GenericModel('users');

exports.loginPage = (req, res) => {
  // Pengecekan aman agar tidak crash jika req.session belum terinisialisasi
  if (req.session && req.session.user) {
    return res.redirect('/admin/dashboard');
  }
  
  res.render('admin/login', { 
    layout: false, 
    error: req.flash ? req.flash('error') : [] 
  });
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // LOG 1: Cek input dari form
    console.log("=== TRYING LOGIN ===");
    console.log("Input Form -> Username:", username, "| Password:", password);

    const user = await Users.findBy('username', username);

    // LOG 2: Cek data user dari DB
    console.log("User DB Found:", user ? user.username : "NOT FOUND");
    console.log("User Active Status:", user ? user.is_active : "N/A");

    // Cek apakah user ada dan is_active bernilai truthy (1 / true)
    if (!user || !user.is_active) {
      console.log("LOGIN FAILED: User not found or inactive");
      req.flash('error', 'Username tidak ditemukan atau akun nonaktif.');
      return req.session.save(() => res.redirect('/admin/login'));
    }

    const match = await bcrypt.compare(password, user.password);
    console.log("Password Match Status:", match);

    if (!match) {
      console.log("LOGIN FAILED: Password incorrect");
      req.flash('error', 'Password salah.');
      return req.session.save(() => res.redirect('/admin/login'));
    }

    // Set Data Session User
    req.session.user = { 
      id: user.id, 
      name: user.name, 
      username: user.username, 
      role: user.role, 
      photo: user.photo 
    };

    req.flash('success', `Selamat datang kembali, ${user.name}!`);
    console.log("LOGIN SUCCESS! Saving session and redirecting to dashboard...");

    // Simpan session secara manual sebelum redirect (Sangat krusial untuk Vercel Serverless)
    req.session.save((err) => {
      if (err) {
        console.error("SESSION SAVE ERROR:", err);
      }
      return res.redirect('/admin/dashboard');
    });

  } catch (err) {
    console.error("LOGIN ERROR CATCH:", err);
    if (req.flash) req.flash('error', 'Terjadi kesalahan sistem.');
    return res.redirect('/admin/login');
  }
};

exports.logout = (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) console.error("LOGOUT ERROR:", err);
      res.redirect('/admin/login');
    });
  } else {
    res.redirect('/admin/login');
  }
};