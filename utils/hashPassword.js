// Usage: node utils/hashPassword.js yourpassword
const bcrypt = require('bcryptjs');
const password = process.argv[2] || 'admin123';
bcrypt.hash(password, 10).then(hash => {
  console.log('Password :', password);
  console.log('Hash     :', hash);
  console.log('\nGunakan hash ini pada kolom `password` di tabel `users` (schema.sql).');
});
