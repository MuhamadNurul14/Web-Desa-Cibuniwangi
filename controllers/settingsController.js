const GenericModel = require('../models/GenericModel');
const ProfileDesa = new GenericModel('profile_desa');
const KontakDesa = new GenericModel('kontak_desa');
const fs = require('fs');
const path = require('path');

exports.profileForm = async (req, res) => {
  const rows = await ProfileDesa.all();
  const profile = rows[0] || {};
  res.render('admin/settings/profile', { title: 'Profile Desa', profile });
};

exports.profileUpdate = async (req, res) => {
  try {
    const rows = await ProfileDesa.all();
    const data = { ...req.body };
    if (req.file) {
      if (rows[0] && rows[0].logo) {
        fs.unlink(path.join(__dirname, '..', 'public', 'uploads', rows[0].logo), () => {});
      }
      data.logo = req.file.filename;
    }
    if (rows[0]) {
      await ProfileDesa.update(rows[0].id, data);
    } else {
      await ProfileDesa.create(data);
    }
    req.flash('success', 'Profile Desa berhasil diperbarui.');
    res.redirect('/admin/profile-desa');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Gagal menyimpan Profile Desa.');
    res.redirect('/admin/profile-desa');
  }
};

exports.kontakForm = async (req, res) => {
  const rows = await KontakDesa.all();
  const kontak = rows[0] || {};
  res.render('admin/settings/kontak', { title: 'Kontak & Lokasi', kontak });
};

exports.kontakUpdate = async (req, res) => {
  try {
    const rows = await KontakDesa.all();
    const data = { ...req.body };
    if (rows[0]) {
      await KontakDesa.update(rows[0].id, data);
    } else {
      await KontakDesa.create(data);
    }
    req.flash('success', 'Informasi Kontak berhasil diperbarui.');
    res.redirect('/admin/kontak-desa');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Gagal menyimpan Kontak Desa.');
    res.redirect('/admin/kontak-desa');
  }
};
