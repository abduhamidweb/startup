import express from 'express';
import userRouter from './user.routes.js';
import productRouter from './products.routes.js';
import technologyRouter from './technology.routes.js'
const router = express.Router();
router.use('/api', userRouter)
router.use('/api', productRouter)
router.use('/api', technologyRouter)

export default router;