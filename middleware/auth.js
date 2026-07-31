function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  req.flash('error', 'Silakan login terlebih dahulu.');
  return res.redirect('/admin/login');
}

function isSuperAdmin(req, res, next) {
  // Pengecekan aman agar tidak crash jika req.session atau req.session.user bernilai null/undefined
  if (req.session && req.session.user && req.session.user.role === 'superadmin') {
    return next();
  }
  req.flash('error', 'Akses ditolak. Hanya Super Admin.');
  return res.redirect('/admin/dashboard');
}

module.exports = {
  isAuthenticated,
  isSuperAdmin
};