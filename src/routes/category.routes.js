import express from 'express';
import CategoryController from "../controller/category.contr.js"
import authMiddleware from '../middleware/auth.mddl.js';
const router = express.Router();
const categoryController = new CategoryController();

// Kategoriya yaratish
router.post('/',authMiddleware, categoryController.createCategory);

// Barcha kategoriyalarni olish
router.get('/', categoryController.getAllCategories);

// Kategoriya ma'lumotini olish
router.get('/:id', categoryController.getCategory);

// Kategoriya ma'lumotini yangilash
router.put('/:id', authMiddleware, categoryController.updateCategory);

// Kategoriyani o'chirish
router.delete('/:id', authMiddleware, categoryController.deleteCategory);

export default router;