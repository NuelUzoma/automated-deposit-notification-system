import { Router } from "express";
import {
    httpSignupUser,
    httpLoginUser,
    httpGetUser,
    httpFindUser
} from '../controllers/user.controller.js';

const userRouter = Router();

userRouter.post('/signup', httpSignupUser);

userRouter.post('/login', httpLoginUser);

userRouter.get('/user', httpGetUser);

userRouter.get('/find', httpFindUser);


export default userRouter;