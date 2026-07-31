const express = require('express');
const router = express.Router();


// ================================
// Import Controllers
// ================================
let authController;
let dashboardController;
let crudController;
let settingsController;
let userController;

try {
  authController = require('../controllers/authController');
} catch (err) {
  console.warn('authController:', err.message);
}

try {
  dashboardController = require('../controllers/dashboardController');
} catch (err) {
  console.warn('dashboardController:', err.message);
}

try {
  crudController = require('../controllers/crudController');
} catch (err) {
  console.warn('crudController:', err.message);
}

try {
  settingsController = require('../controllers/settingsController');
} catch (err) {
  console.warn('settingsController:', err.message);
}

try {
  userController = require('../controllers/userController');
} catch (err) {
  console.warn('userController:', err.message);
}



// ================================
// Authentication Middleware
// ================================
const checkAuth = (req, res, next) => {

  try {

    const auth = require('../middleware/auth');

    if (typeof auth === 'function') {
      return auth(req, res, next);
    }

    if (auth?.isAuthenticated) {
      return auth.isAuthenticated(req, res, next);
    }

  } catch (err) {}


  if (req.session?.user) {
    return next();
  }


  req.flash(
    'error',
    'Silakan login terlebih dahulu.'
  );

  return res.redirect('/admin/login');
};



// ================================
// PUBLIC ADMIN
// ================================


// Halaman Login
router.get('/login', (req, res) => {

  if (authController?.renderLogin) {
    return authController.renderLogin(req,res);
  }


  if (authController?.loginPage) {
    return authController.loginPage(req,res);
  }


  res.render('admin/login',{
    layout:false,
    title:'Login Admin'
  });

});


// Proses Login
router.post('/login',(req,res,next)=>{

  if(authController?.login){
    return authController.login(req,res,next);
  }


  res.redirect('/admin/login');

});


// Logout
router.get('/logout',(req,res,next)=>{

  if(authController?.logout){
    return authController.logout(req,res,next);
  }


  req.session.destroy(()=>{
    res.redirect('/admin/login');
  });

});




// ================================
// PROTECTED ADMIN
// ================================

router.use(checkAuth);



router.get('/',(req,res)=>{

  res.redirect('/admin/dashboard');

});



// Dashboard
router.get('/dashboard',(req,res,next)=>{

  if(dashboardController?.index){
    return dashboardController.index(req,res,next);
  }


  res.render('admin/dashboard',{
    title:'Dashboard',
    user:req.session.user
  });

});





// ================================
// CRUD MANAGEMENT
// ================================


// LIST DATA
router.get('/crud/:module',(req,res,next)=>{

  if(crudController?.index){
    return crudController.index(req,res,next);
  }


  res.render('admin/crud/index',{
    title:req.params.module,
    module:req.params.module,
    data:[],
    user:req.session.user
  });

});



// FORM TAMBAH
router.get('/crud/:module/create',(req,res,next)=>{

  if(crudController?.create){
    return crudController.create(req,res,next);
  }


  res.render('admin/crud/form',{
    title:`Tambah ${req.params.module}`,
    module:req.params.module,
    data:{},
    user:req.session.user
  });

});



// SIMPAN DATA
router.post('/crud/:module',(req,res,next)=>{

  if(crudController?.store){
    return crudController.store(req,res,next);
  }


  res.redirect(`/admin/crud/${req.params.module}`);

});



// FORM EDIT
router.get('/crud/:module/:id/edit',(req,res,next)=>{


  if(crudController?.edit){
    return crudController.edit(req,res,next);
  }


  res.render('admin/crud/form',{
    title:`Edit ${req.params.module}`,
    module:req.params.module,
    data:{},
    user:req.session.user
  });

});



// UPDATE DATA
router.put('/crud/:module/:id',(req,res,next)=>{

  if(crudController?.update){
    return crudController.update(req,res,next);
  }


  res.redirect(`/admin/crud/${req.params.module}`);

});



// DELETE DATA
router.delete('/crud/:module/:id',(req,res,next)=>{

  if(crudController?.destroy){
    return crudController.destroy(req,res,next);
  }


  res.redirect(`/admin/crud/${req.params.module}`);

});





// ================================
// SETTINGS
// ================================

router.get('/settings/profile',(req,res,next)=>{

  if(settingsController?.profile){
    return settingsController.profile(req,res,next);
  }


  res.render('admin/settings/profile',{
    title:'Profile Desa',
    user:req.session.user
  });

});



router.get('/settings/kontak',(req,res,next)=>{

  if(settingsController?.kontak){
    return settingsController.kontak(req,res,next);
  }


  res.render('admin/settings/kontak',{
    title:'Kontak Desa',
    user:req.session.user
  });

});





// ================================
// USER MANAGEMENT
// ================================

router.get('/users',(req,res,next)=>{

  if(userController?.index){
    return userController.index(req,res,next);
  }


  res.render('admin/users/index',{
    title:'Management User',
    user:req.session.user
  });

});




// ================================
// STATIC ADMIN PAGE FALLBACK
// ================================

router.get('/:page',(req,res)=>{

  const page=req.params.page;


  res.render('admin/coming-soon',{
    title:page.replace(/[-_]/g,' '),
    page,
    user:req.session.user
  });

});



module.exports = router;