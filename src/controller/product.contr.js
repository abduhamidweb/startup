import {
  JWT
} from "../utils/jwt.js";
import Products from "../schemas/product.schema.js";
import Technologies from "../schemas/technology.schema.js";
import categoryArr from "../utils/categories.data.js";
import validator from 'validator';
const errorObj = (err) => {
  return {
    status: 400,
    message: `Error: ${err?.message}`,
    success: false,
  };
};
class ProductController {
  static async getProductMyOwn(req, res) {
    try {
      const token = req.headers.token;
      const id = JWT.VERIFY(token).id;
      let product = await Products.find({
        user: id
      })
      res.send(product)
    } catch (error) {
      console.log('error :', error);

    }
  }
  static async getProduct(req, res) {
    try {
      let {
        id
      } = req.params;
      let {
        category,
        technology
      } = req.query;

      let keyword = req.query.search ? {
        $or: [{
            name: {
              $regex: req.query.search,
              $options: "i"
            }
          },
          {
            price: {
              $regex: req.query.search,
              $options: "i"
            }
          },
          {
            desc: {
              $regex: req.query.search,
              $options: "i"
            }
          },
          {
            github_link: {
              $regex: req.query.search,
              $options: "i"
            }
          },
          {
            product_link: {
              $regex: req.query.search,
              $options: "i"
            }
          },
        ],
      } : {};
      if (id) {
        let dataById = await Products.findById(id)
          .populate("user")
          .populate("technology");
        if (dataById == null) {
          throw new Error(`Not Found ${id} - product!`);
        }

        let categoryCount = {};
        if (dataById.category.category) {
          categoryCount[dataById.category] += 1
        } else {
          categoryCount[dataById.category] = 1
        }

        const technologiesCount = {};

        const techs = dataById.technology;
        for (let i = 0; i < techs.length; i++) {
          const techName = techs[i].name;
          if (technologiesCount.hasOwnProperty(techName)) {
            technologiesCount[techName]++;
          } else {
            technologiesCount[techName] = 1
          }
        }

        let others = await Products.find({
          category: dataById.category
        });
        others = others.filter((el) => el._id != id);
        res
          .send({
            status: 200,
            message: `${id} - product`,
            success: true,
            countCategory: categoryCount,
            countTechnology: technologiesCount,
            data: {
              others,
              data: dataById
            },
          })
          .status(200);
      } else if (req.query?.search) {
        let allProduct = await Products.find()
          .populate("user")
          .populate("technology");

        let filtered = allProduct.filter((el) =>
          el.name
          .toLocaleLowerCase()
          .includes(req.query.search.toLocaleLowerCase())
        );

        let categoryCount = {};
        for (let i = 0; i < filtered.length; i++) {
          let category = filtered[i];
          if (categoryCount[category.category]) {
            categoryCount[category.category] += 1;
          } else {
            categoryCount[category.category] = 1;
          }
        }
        const technologiesCount = {};
        for (let i = 0; i < filtered.length; i++) {
          const techs = filtered[i].technology;
          for (let j = 0; j < techs.length; j++) {
            const techName = techs[j].name;
            if (technologiesCount.hasOwnProperty(techName)) {
              technologiesCount[techName]++;
            } else {
              technologiesCount[techName] = 1;
            }
          }
        }
        console.log(technologiesCount);
        res.send({
          countCategory: categoryCount,
          countTechnology: technologiesCount,
          status: 200,
          message: "Search Result, Searching By Title",
          success: true,
          data: filtered,
        });
      } else if (category) {
        let findByCat = await Products.find({
            category
          })
          .populate("user")
          .populate("technology")
          .sort({
            createdAt: -1
          });
        let categoryCount = {};
        for (let i = 0; i < findByCat.length; i++) {
          let category = findByCat[i];
          if (categoryCount[category.category]) {
            categoryCount[category.category] += 1;
          } else {
            categoryCount[category.category] = 1;
          }
        }
        const technologiesCount = {};
        for (let i = 0; i < findByCat.length; i++) {
          const techs = findByCat[i].technology;
          for (let j = 0; j < techs.length; j++) {
            const techName = techs[j].name;
            if (technologiesCount.hasOwnProperty(techName)) {
              technologiesCount[techName]++;
            } else {
              technologiesCount[techName] = 1;
            }
          }
        }
        res.send({
          status: 200,
          message: `${category} - products`,
          countCategory: categoryCount,
          countTechnology: technologiesCount,
          success: true,
          data: findByCat
        });
      } else {
        const products = await Products.find()
          .populate("user")
          .populate("technology")
          .sort({
            createdAt: -1
          });
        let categoryCount = {};
        for (let i = 0; i < products.length; i++) {
          let category = products[i];
          if (categoryCount[category.category]) {
            categoryCount[category.category] += 1;
          } else {
            categoryCount[category.category] = 1;
          }
        }
        const technologiesCount = {};
        for (let i = 0; i < products.length; i++) {
          const techs = products[i].technology;
          for (let j = 0; j < techs.length; j++) {
            const techName = techs[j].name;
            if (technologiesCount.hasOwnProperty(techName)) {
              technologiesCount[techName]++;
            } else {
              technologiesCount[techName] = 1;
            }
          }
        }
        res.send({
          status: 200,
          countCategory: categoryCount,
          countTechnology: technologiesCount,
          message: "Products",
          data: products,
          success: true,
        });
      }
    } catch (error) {
      res.send(errorObj(error));
    }
  }
  static async addProduct(req, res) {
    try {
      let {
        token
      } = req.headers;
      let {
        id
      } = JWT.VERIFY(token);
      let {
        name,
        technology,
        category,
        img_link,
        product_link,
        desc,
        price,
        github_link,
        phone,
      } = req.body;
      if (!validator.isMobilePhone(phone)) {
        return res.status(400).json({
          error: 'Noto\'g\'ri telefon raqami formati'
        });
      }
      if (!validator.isURL(product_link)) {
        return res.status(400).json({
          error: 'Noto\'g\'ri product_link URL'
        });
      }
      if (github_link) {
        if (!validator.isURL(github_link)) {
          return res.status(400).json({
            error: 'Noto\'g\'ri github_link URL'
          });
        }
      }

      if (!validator.isURL(img_link)) {
        return res.status(400).json({
          error: 'Noto\'g\'ri img_link URL'
        });
      }
      if (
        !name ||
        !technology ||
        !category ||
        !product_link ||
        !phone ||
        !img_link
      ) {
        throw new Error("Data is incomplated! ❌");
      }
      let newProduct = await Products.create({
        name,
        technology,
        user: id,
        category,
        product_link,
        img_link,
        desc,
        price,
        github_link,
        phone_number: phone,
      });

      if (!newProduct) {
        throw new Error(`Product not added!`);
      }
      res.send({
        status: 200,
        message: "product added!",
        success: true,
        data: newProduct,
      });
    } catch (error) {
      res.send(errorObj(error));
    }
  }

  static async addTechnologyToProduct(req, res) {
    try {
      let {
        product_id
      } = req.params;
      let {
        token
      } = req.headers;
      let {
        id
      } = JWT.VERIFY(token);
      let findProduct = await Products.findById(product_id);

      let {
        technology
      } = req.body;
      if (!technology) {
        throw new Error(`you must send technology from request body!`);
      }
      if (findProduct == null) {
        throw new Error(`Not Found ${product_id} - product`);
      }
      let checkTechFromArr = await Products.findById(product_id);
      if (checkTechFromArr.user != id) {
        throw new Error(`you cannot update other's product!`);
      }
      let techns = await Technologies.findById(technology);
      if (techns == null) {
        throw new Error(`Not Found ${technology} - technolgy!`);
      }
      if (checkTechFromArr.technology.includes(technology)) {
        throw new Error(`This Product already added!`);
      }

      let updatedTechnology = await Products.findByIdAndUpdate(
        product_id, {
          $push: {
            technology: technology
          }
        }, {
          new: true
        }
      );
      res.send({
        status: 201,
        message: "OK, added technology",
        success: true,
        data: updatedTechnology,
      });
    } catch (error) {
      res.send(errorObj(error));
    }
  }

  static async deleteTechnologyToProduct(req, res) {
    try {
      let {
        product_id
      } = req.params;
      let {
        token
      } = req.headers;
      let {
        id
      } = JWT.VERIFY(token);
      let {
        technology
      } = req.body;
      if (!technology) {
        throw new Error(`you must send technology from request body!`);
      }

      let checkTechFromArr = await Products.findById(product_id);
      if (checkTechFromArr == null) {
        throw new Error(`Not Found ${product_id} - product`);
      }
      if (checkTechFromArr.user != id) {
        throw new Error(`you cannot update other's product!`);
      }
      if (!checkTechFromArr.technology.includes(technology)) {
        throw new Error(`Technology Not Found`);
      }

      let deletedTechnology = await Products.findByIdAndUpdate(
        product_id, {
          $pull: {
            technology: technology
          }
        }, {
          new: true
        }
      );
      res.send({
        status: 200,
        message: "OK, Deleted",
        success: true,
        data: await Products.findById(deletedTechnology._id),
      });
    } catch (error) {
      res.send(errorObj(error));
    }
  }

  static async updateProduct(req, res) {
    try {
      let {
        product_id
      } = req.params;
      let {
        token
      } = req.headers;
      let {
        id
      } = JWT.VERIFY(token);
      let findProductById = await Products.findById(product_id);
      if (findProductById == null) {
        throw new Error(`Not Found ${id} - product!`);
      }
      if (findProductById.user != id) {
        throw new Error(`You can not update other people's product!`);
      }
      let {
        name,
        category,
        product_link,
        desc,
        price,
        github_link,
        phone,
        img_link,
      } = req.body;
      if (
        !name &&
        !category &&
        !product_link &&
        !desc &&
        !price &&
        !img_link &&
        !github_link &&
        !phone
      ) {
        throw new Error(`You have not send data!`);
      }
          if (!validator.isMobilePhone(phone)) {
            return res.status(400).json({
              error: 'Noto\'g\'ri telefon raqami formati'
            });
          }
          if (!validator.isURL(product_link)) {
            return res.status(400).json({
              error: 'Noto\'g\'ri product_link URL'
            });
          }
          if (github_link) {
            if (!validator.isURL(github_link)) {
              return res.status(400).json({
                error: 'Noto\'g\'ri github_link URL'
              });
            }
          }

          if (!validator.isURL(img_link)) {
            return res.status(400).json({
              error: 'Noto\'g\'ri img_link URL'
            });
          }
      let updatedProduct = await Products.findByIdAndUpdate(
        product_id, {
          name,
          category,
          product_link,
          desc,
          price,
          github_link,
          phone,
          img_link,
        }, {
          new: true
        }
      );
      res.send({
        status: 200,
        message: "Updated successfuly!",
        success: true,
        data: updatedProduct,
      });
    } catch (error) {
      res.send(errorObj(error));
    }
  }

  static async deleteProduct(req, res) {
    try {
      let {
        product_id
      } = req.params;

      let {
        token
      } = req.headers;
      let {
        id
      } = JWT.VERIFY(token);
      let findProductById = await Products.findById(product_id);
      if (findProductById == null) {
        throw new Error(`Not Found ${product_id} - product!`);
      }
      if (findProductById.user != id) {
        throw new Error(`You can not update other people's product!`);
      }
      let deleteProduct = await Products.findByIdAndDelete(product_id);
      if (!deleteProduct) {
        throw new Error(`The Product was not deleted!`);
      }
      res.send({
        status: 200,
        message: `Deleted ${product_id} - product`,
        success: true,
        data: deleteProduct,
      });
    } catch (error) {
      res.send(errorObj(error));
    }
  }
}

export default ProductController;