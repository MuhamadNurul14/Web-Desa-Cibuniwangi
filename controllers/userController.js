const bcrypt = require('bcryptjs');
const GenericModel = require('../models/GenericModel');
const Users = new GenericModel('users');

exports.index = async (req, res) => {
  const items = await Users.all();
  res.render('admin/users/index', { title: 'Management User', items });
};

exports.create = (req, res) => {
  res.render('admin/users/form', { title: 'Tambah User', item: {}, mode: 'create' });
};

exports.store = async (req, res) => {
  try {
    const { name, username, email, password, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    await Users.create({ name, username, email, password: hashed, role, is_active: 1 });
    req.flash('success', 'User berhasil ditambahkan.');
    res.redirect('/admin/users');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Gagal menambahkan user: ' + err.message);
    res.redirect('/admin/users/create');
  }
};

exports.edit = async (req, res) => {
  const item = await Users.find(req.params.id);
  res.render('admin/users/form', { title: 'Edit User', item, mode: 'edit' });
};

exports.update = async (req, res) => {
  try {
    const { name, username, email, password, role, is_active } = req.body;
    const data = { name, username, email, role, is_active: is_active ? 1 : 0 };
    if (password && password.trim() !== '') {
      data.password = await bcrypt.hash(password, 10);
    }
    await Users.update(req.params.id, data);
    req.flash('success', 'User berhasil diperbarui.');
    res.redirect('/admin/users');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Gagal memperbarui user.');
    res.redirect(`/admin/users/${req.params.id}/edit`);
  }
};

exports.destroy = async (req, res) => {
  if (parseInt(req.params.id) === req.session.user.id) {
    req.flash('error', 'Anda tidak dapat menghapus akun sendiri.');
    return res.redirect('/admin/users');
  }
  await Users.delete(req.params.id);
  req.flash('success', 'User berhasil dihapus.');
  res.redirect('/admin/users');
};
