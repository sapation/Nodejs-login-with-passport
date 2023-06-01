import express from 'express';

import UserController from '../controller/users.js';

const router = express.Router();


router.get('/login', (req, res)=>{
    res.render('login')
});


router.get('/register', (req, res)=>{
    res.render('register')
});

router.get('/forgotpassword', (req, res)=>{
    res.render('forgotpassword')
});

// Register Handle 
router.post('/register', UserController.register);

// Login handler
router.post('/login', UserController.login);

// Email confirm handler
router.get('/confirmation/:token', UserController.confirmEmail);

//reset password
router.get('/reset-password/:token', UserController.resetPassword);

//forgot password email filed
router.post('/forgotPassword', UserController.forgotPassword);

//update password route
router.post('/update-password', UserController.updatePassword);

// Logout Handler
router.get('/logout', UserController.logout)

export default router;