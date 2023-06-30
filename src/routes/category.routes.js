import express from 'express';
import CategoryController from '../controller/category.contr.js';
const router = express.Router();
router.get('/categories', CategoryController.getAllCategory)
export default router;