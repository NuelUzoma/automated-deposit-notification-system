import express from 'express';
const app = express();
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import dotenv from 'dotenv';
import { sessionStore } from './database/db.connect.js';
import logger from './logging/logger.js';
import errorHandler from './middlewares/errorHandler.middleware.js';
import morganMiddleware from './middlewares/morgan.middleware.js';
import userRouter from './routes/user.route.js';
import walletRouter from './routes/wallet.route.js';

dotenv.config();

app.use( cors({
    origin: 'http://localhost:3000',
    credentials: true
}) );

// Additional CORS Middleware, Very Important
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PATCH,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    if ('OPTIONS' == req.method) {
        res.send(200);
    } else {
        next();
    }
});

// Add the morgan middleware
app.use(morganMiddleware);

const PORT = 3000;

app.use( helmet() );

// To parse data passed via body
app.use(express.json({ limit: '100mb' })); // A limit of 100mb is set

// To parse url encoded data
app.use(express.urlencoded({limit: '100mb', extended: true, parameterLimit:50000}));

// Session handler
app.use(cookieParser(process.env.SESSION_SECRET));
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
app.use('/api/auth', userRouter);

// Wallet Router
app.use('/api/wallets', walletRouter);

// Import the scheduled automated deposits service
import './services/scheduleDeposits.service.js';

app.listen(PORT, () => {
    logger.info(`Server is running on PORT ${PORT}`)
});

// Error handler
app.use(errorHandler);


export default app;
