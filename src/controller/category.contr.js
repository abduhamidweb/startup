import Category from "../schemas/category.schema.js";
import productSchema from "../schemas/product.schema.js";

class CategoryController {
    async createCategory(req, res) {
        try {
            const {
                categoryname
            } = req.body;
            const category = new Category({
                categoryname
            });
            await category.save();
            res.status(201).json(category);
        } catch (error) {
            res.status(500).json({
                error: 'Kategoriya yaratishda xatolik yuz berdi'
            });
        }
    }

    async getAllCategories(req, res) {
        try {
            const categories = await Category.find();
            const product = await productSchema.find()

            function countCategories(categories, products) {
                const result = [];

                categories.forEach((category) => {
                    const count = products.filter((product) => product.category.toLowerCase() === category.categoryname.toLowerCase()).length;
                    result.push({
                        category: category.categoryname,
                        count,
                    });
                });

                return result;
            }
            const countedCategories = countCategories(categories, product);
            res.status(200).json(countedCategories);
        } catch (error) {
            res.status(500).json({
                error: 'Kategoriyalarni olishda xatolik yuz berdi'
            });
        }
    }

    async getCategory(req, res) {
        try {
            const category = await Category.findById(req.params.id);
            if (!category) {
                return res.status(404).json({
                    error: 'Kategoriya topilmadi'
                });
            }
            res.status(200).json(category);
        } catch (error) {
            res.status(500).json({
                error: 'Kategoriya ma\'lumotini olishda xatolik yuz berdi'
            });
        }
    }

    async updateCategory(req, res) {
        try {
            const {
                categoryname
            } = req.body;
            const category = await Category.findByIdAndUpdate(req.params.id, {
                categoryname
            }, {
                new: true
            });
            if (!category) {
                return res.status(404).json({
                    error: 'Kategoriya topilmadi'
                });
            }
            res.status(200).json(category);
        } catch (error) {
            res.status(500).json({
                error: 'Kategoriya ma\'lumotini yangilashda xatolik yuz berdi'
            });
        }
    }

    async deleteCategory(req, res) {
        try {
            const category = await Category.findByIdAndRemove(req.params.id);
            if (!category) {
                return res.status(404).json({
                    error: 'Kategoriya topilmadi'
                });
            }
            res.status(200).json({
                message: 'Kategoriya muvaffaqiyatli o\'chirildi'
            });
        } catch (error) {
            res.status(500).json({
                error: 'Kategoriyani o\'chirishda xatolik yuz berdi'
            });
        }
    }
}

export default CategoryController;