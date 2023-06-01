import passport from 'passport';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

import DatabaseModel from '../models/DatabaseModel.js';
import {sendConfirmation, sendResetPassword}  from '../utils/sendConfirmation.js';

const UserModel = new DatabaseModel('users');


class UserController {

    async register(req, res) {
        const { name, email, password, password2 } = req.body;
        name.trim();
        email.trim();
        password.trim();
        password2.trim();
        let errors = [];
        // Check required fields
        if(!name || !email || !password || !password2) {
            errors.push({msg: 'Please fill in all fields'});
        }

        // Check password match
        if(password !=password2) {
            errors.push({msg: 'Passwords do not match'});
        }
        // Check password length
        if(password.length < 6) {
            errors.push({msg: 'Password should be at least 6 characters'});
        }

        if(errors.length > 0) {
            res.render('register', {
                errors,
                name,
                email,
                password,
                password2
            })
        } else {
            // Validation pass
            const user = await UserModel.findEmail(email);

            if(user) {
                // User Exist
                errors.push({msg: "Email is already exist change another one"})
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                })
            } else {
                const newUser ={
                    name,
                    email,
                    password,
                    confirm: false
                }
                bcrypt.genSalt(10, (err, salt)=> {
                    bcrypt.hash(password, salt, (err, hash)=> {
                        if(err) throw err;
                        newUser.password = hash;
                        UserModel.create(newUser).then(user=> {
                            sendConfirmation(user, req);
                            req.flash('success_msg', 'You are now registed please check your email to activate')
                            res.redirect('/users/login')
                        }).catch(err=> console.log(err));
                    });
                });
            }
        }
    }

    async confirmEmail(req, res) {
            try {
              const { id } = jwt.verify(req.params.token, process.env.JWT_SECRET);
              UserModel.update(id, {confirm: true});

              req.flash('success_msg', 'Account activated you can now login')
              res.redirect('/users/login');
            } catch (e) {
              console.log(e)
            }

    }

    async resetPassword(req, res) {
            try {
              const token = req.params.token;
              const { id } = jwt.verify(token, process.env.JWT_SECRET);
              if(id) {
                res.render('resetpassword', {id});
              }
            } catch (e) {
              console.log(e)
            }
    }

    async forgotPassword(req, res) {
        try {
            const {email} = req.body;
            console.log(req.body);
            let errors = [];

            if(!email) {
                errors.push({msg: "Please fill in your email"});
            }

            if(errors.length > 0) {
                res.render('forgotpassword', {errors, email});
            }else {
               UserModel.findEmail(email).then(user => {
                    if(!user) {
                        errors.push({msg: "User does not exist for this email"})
                    } else {
                        sendResetPassword(user);
                        req.flash('success_msg', 'Reset email has been sent to your mail')
                        res.redirect('/users/forgotpassword');
                    }
               });

            }
        } catch (error) {
            console.log(error)
        }
    }

    async updatePassword (req, res) {
        try {
            const {id, password, password2} = req.body;
            let errors = [];

            if(!password || !password2) {
                errors.push({msg: "Please in all the fields"});
            }

            // Check password match
            if(password !=password2) {
                errors.push({msg: 'Passwords do not match'});
            }

            if(errors.length > 0) {
                res.render('resetpassword', {errors, password, password2});
            } else {
                const user = await UserModel.findById(id);

                if(!user) {
                    errors.push({msg: "User does exist "});
                    res.render('resetpassword',{
                        errors,
                        password,
                        password2
                    })
                } else {
                    
                    bcrypt.genSalt(10, (err, salt)=> {
                        bcrypt.hash(password, salt, (err, hash)=> {
                            if(err) throw err;
                            UserModel.update(id, {password: hash}).then(user=> {
                                req.flash('success_msg', 'Your password has been updated succesfully')
                                res.redirect('/users/login')
                            }).catch(err=> console.log(err));
                        });
                    });
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    async login(req, res, next){
        const {email, password} = req.body;
        let errors = [];
        // Check required fields
        if(!email || !password ) {
            errors.push({msg: 'Please fill in all fields'});
        }
    
        if(errors.length > 0) {
            console.log(email)
            res.render('login', {
                errors,
                email,
                password
            })
        } else {
            passport.authenticate('local',{
                successRedirect: '/dashboard',
                failureRedirect: '/users/login',
                failureFlash: true
            })(req, res, next)
        }
    }

    async logout(req, res){
        req.logout(function(err) {
            if (err) { return next(err); }
            req.flash('sucess_msg', 'You are logged out');
            res.redirect('/users/login')
          });
       
    }
}


export default new UserController;