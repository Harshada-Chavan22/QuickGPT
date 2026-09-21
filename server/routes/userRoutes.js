import express from 'express'
import { getUser, loginUser, registerUser } from '../controllers/userController';
import { protect } from '../middlewares/auth';

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/data', protect, getUser)

export default userRouter;