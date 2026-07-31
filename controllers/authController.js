const bcrypt = require('bcryptjs');
const GenericModel = require('../models/GenericModel');
const Users = new GenericModel('users');

exports.loginPage = (req, res) => {
  if (req.session.user) return res.redirect('/admin/dashboard');
  res.render('admin/login', { layout: false, error: req.flash('error') });
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await Users.findBy('username', username);

    if (!user || !user.is_active) {
      req.flash('error', 'Username tidak ditemukan atau nonaktif.');
      return res.redirect('/admin/login');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      req.flash('error', 'Password salah.');
      return res.redirect('/admin/login');
    }

    req.session.user = { id: user.id, name: user.name, username: user.username, role: user.role, photo: user.photo };
    req.flash('success', `Selamat datang kembali, ${user.name}!`);
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Terjadi kesalahan sistem.');
    res.redirect('/admin/login');
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
};
