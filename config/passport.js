
import { Strategy as LocalStrategy } from 'passport-local';
import DatabaseModel from '../models/DatabaseModel.js'
import bcrypt from 'bcrypt'

// Load model
const UserModel = new DatabaseModel('users');

const localStrategy = function(passport) {
    passport.use(
        new LocalStrategy({usernameField: 'email'},(email, password, done) =>{
            UserModel.findEmail(email).then(user=>{
                if(!user) {
                    return done(null, false, {message: 'That email is not registered' })
                }

                if(!user.confirm) {
                    return done(null, false, {message: 'Please Check your email to active first' });
                }

                // Match password
                bcrypt.compare(password, user.password, (err, isMatch)=>{
                    if(err) throw err;

                    if(isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, {message: 'Password is Incorrect'})
                    }
                })
            }).catch(err=> console.log(err))
        })
    );

    passport.serializeUser((user, cb)=> {
        process.nextTick(()=> {
          return cb(null, {
            id: user.id,
            name: user.name,
            // picture: user.picture
          });
        });
      });
      
      passport.deserializeUser((user, cb)=> {
        process.nextTick(()=> {
          return cb(null, user);
        });
      });
}

export default localStrategy;