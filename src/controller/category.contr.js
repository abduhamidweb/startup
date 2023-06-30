import productSchema from "../schemas/product.schema.js";
class CategoryController {
    // Create a new user
    static async getAllCategory(req, res) {
        try {

            let category = await productSchema.find()
            function countProductsByCategory(products) {
                let categoryCount = {};
                for (let i = 0; i < products.length; i++) {
                    let category = products[i].category;
                    if (categoryCount.hasOwnProperty(category)) {
                        categoryCount[category]++;
                    } else {
                        categoryCount[category] = 1;
                    }
                }
                let result = [];
                for (let category in categoryCount) {
                    result.push({
                        category: category,
                        count: categoryCount[category]
                    });
                }
                return result;
            }

            // Misol uchun kategoriya bo'yicha mahsulotlar sonini hisoblash
            let categoryCounts = countProductsByCategory(category);

            res.send({
                status: 200,
                message: 'All Categories',
                success: true,
                data: categoryCounts
            })
        } catch (error) {
            res.send({
                status: 400,
                message: `Error : ${error.message}`,
                success: false
            })
        }
    }


}




export default CategoryController;