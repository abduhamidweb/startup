import express from 'express';
import userRouter from './user.routes.js';
import productRouter from './products.routes.js';
import technologyRouter from './technology.routes.js'
import categoryArr from '../utils/categories.data.js';
const router = express.Router();
router.use('/api', userRouter)
router.use('/api', productRouter)
router.use('/api', technologyRouter)
router.use('/api/categories', async(req, res)=>{
    try {
        res.send({
            status : 200,
            message : 'All Categories',
            success : true,
            data : categoryArr
        })
    } catch (error) {
        res.send({
            status : 400,
            message : `Error : ${error.message}`,
            success : false
        })
    }
})

export default router;