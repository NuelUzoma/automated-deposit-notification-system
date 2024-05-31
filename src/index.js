import express from 'express';
const app = express();
import helmet from 'helmet';
import passport from 'passport';
import dotenv from 'dotenv';

dotenv.config;

const PORT = 3000;

app.use( helmet() );

// To parse data passed via body
app.use(express.json({ limit: '100mb' })); // A limit of 100mb is set

// To parse url encoded data
app.use(express.urlencoded({limit: '100mb', extended: true, parameterLimit:50000}));

// Passport session initialization
app.use(passport.initialize());

app.use(passport.session());



app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
});
