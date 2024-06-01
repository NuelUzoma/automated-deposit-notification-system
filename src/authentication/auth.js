import passport from "passport";
import LocalStrategy from 'passport-local';
import { findUser } from '../database/queries/user.js';
import { Users } from '../database/db.connect.js'


// Passport Login Strategy
passport.use(
    'login',
    new LocalStrategy.Strategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        (email, password, done) => {
            const userData = { email };

            findUser(userData)
                .then((user) => {
                    if (!user) {
                        return done(null, false, { message: 'User not found' });
                    }

                    return user.validPassword(password)
                        .then((validate) => {
                            if (!validate) {
                                return done(null, false, { message: 'Wrong Password' });
                            }
                            return done(null, user, { message: 'Logged in Successfully' });
                        });
                    
                })
                .catch((error) => {
                    console.log(error);
                    return done(error);
                });
        }
    )
);

// Serialize user
passport.serializeUser((user, done) => {
    done(null, user);
});

// Deserialize User
passport.deserializeUser((user, done) => {
    console.log('Deserializing User ', user);
    Users.findByPk(user.id).then((user) => done(null, user));
});


export default passport;