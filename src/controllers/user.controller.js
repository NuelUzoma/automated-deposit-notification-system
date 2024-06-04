import passport from 'passport';
import {
    createUser,
    findUser
} from '../database/queries/user.js';


// Signup
export async function httpSignupUser(req, res, next) {
    try {
        const userData = req.body;
        await createUser(userData);
        res.status(201).json({
            success: true,
            message: 'user successfully created'
        });
    } catch(err) {
        next(err);
    }
}

// Login
export async function httpLoginUser(req, res, next) {
    passport.authenticate('login', {session: true}, async (err, user, info) => {
        try {
            if (err) {
                return next(err);
            }
            if (!user) {
                const error = new Error('email or password is incorrect');
                return next(error);
            }
            req.logIn(user, err => {
                if (err){
                    next(err);
                } else {
                    res.json({
                        success: true,
                        message: info.message
                    });
                }
                console.log(user);
            });
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
}

// Find a user
export async function httpFindUser(req, res, next) {
    try {
        const userData = req.body;
        const user = await findUser(userData);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({
                message: 'User not found'
            });
        }
    } catch (err) {
        next(err);
    }
}

// Validate logged in user
export async function httpGetUser(req, res, next) {
    try {
        const user = req.user;

        setTimeout(()=>{
            console.log(user);
            console.log('Is User Authenticated?: ',req.isAuthenticated());
            if (user) {
                return res.json({ user });
            } else {
                return res.status(404).json({ message: 'Req Error: You are not logged in'});
            }
        }, 3000); // 3 seconds timeout to fetch logged in user details
    } catch (err){
        next(err);
    }
}