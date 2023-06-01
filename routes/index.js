import express from 'express';
import authenticated from '../config/auth.js';

const router = express.Router();

router.get('/', (req, res)=>{
    res.render('welcome')
})

router.get('/dashboard',authenticated, (req, res)=>{
    console.log(req.user);
    res.render('dashboard', {
        name: req.user.name
    })
})

export default router;