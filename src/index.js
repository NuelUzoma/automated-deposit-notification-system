import express from 'express';
const app = express();
import helmet from 'helmet';
import passport from 'passport';
import session from 'express-session';
import dotenv from 'dotenv';
import { sessionStore } from './database/db.connect.js';
import logger from './logging/logger.js';
import errorHandler from './middlewares/errorHandler.middleware.js';
import morganMiddleware from './middlewares/morgan.middleware.js';
import userRouter from './routes/user.route.js';

dotenv.config();

// Add the morgan middleware
app.use(morganMiddleware);

const PORT = 3000;

app.use( helmet() );

// To parse data passed via body
app.use(express.json({ limit: '100mb' })); // A limit of 100mb is set

// To parse url encoded data
app.use(express.urlencoded({limit: '100mb', extended: true, parameterLimit:50000}));

// Session handler
app.use(session({
    name: 'adns',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        secure: false,
        httpOnly: false,
        sameSite: 'none'
    },
}));

import './authentication/auth.js'

// Passport session initialization
app.use(passport.initialize());

app.use(passport.session());

// User Router
app.use('/v1/auth', userRouter);


app.listen(PORT, () => {
    logger.info(`Server is running on PORT ${PORT}`)
});

// Error handler
app.use(errorHandler);


export default app;
