import Technologies from "../schemas/technology.schema.js";
import Products from "../schemas/product.schema.js";
import {
  JWT
} from "../utils/jwt.js";
import {
  User
} from "../schemas/user.schema.js";

const errorObj = (err) => {
  return {
    status: 400,
    message: `Error: ${err?.message}`,
    success: false,
  };
};

class TechnologyController {
  constructor() {}
  static async Get(req, res) {
    try {
      let {
        id
      } = req.params;
      let {
        name
      } = req.query;
      if (id) {
        let data = await Technologies.findById(id);
        if (data == null) {
          throw new Error(`${id} - technology Not Found!`)
        }
        res.send({
          status: 200,
          message: `${id} - technology products`,
          success: true,
          data: data,
        });
      } else if (name) {
        let findByNameCat = await Technologies.findOne({
          name
        });
        if (findByNameCat == null) {
          throw new Error(`Qanday Yozilgan bo'lsa shunday filter qiling, katta yoki kichik harifiga ham e'tibor bering, to'liq yozing!`)
        }
        res.send({
          status: 200,
          message: `${name} - technology products`,
          success: true,
          data: findByNameCat,
        });
      } else {
        let technology = await Technologies.find();
        let products = await Products.find().populate("technology");
        const technologyNames = {};

        // Teknoloji adlarını ve sayılarını hesaplamak için ürünleri döngüleyin
        products.forEach(product => {
          product.technology.forEach(tech => {
            const techName = tech.name;
            if (technologyNames.hasOwnProperty(techName)) {
              technologyNames[techName]++;
            } else {
              technologyNames[techName] = 1;
            }
          });
        });

        // Teknoloji dizisini döngüleyerek count özelliğini ekleyin
        technology = technology.map(tech => {
          const techName = tech.name;
          tech.__v = technologyNames[techName] || 0;
          return tech;
        });

        // console.log(technology);
        res.send({
          status: 200,
          message: "All Technologies",
          success: true,
          data: technology
        });
      }
    } catch (error) {
      res.send(errorObj(error));
    }
  }

  static async Post(req, res) {
    try {
      let {
        name,
        img_link
      } = req.body;
      let {
        token
      } = req.headers;
      let {
        id
      } = JWT.VERIFY(token);
      let checkAdmin = await User.findById(id);
      if (checkAdmin.role != "admin") {
        throw new Error("Only admin can add!");
      }
      let newTechnology = await Technologies.create({
        name,
        img_link
      });
      if (!newTechnology) {
        throw new Error(`Not added technology!`);
      }
      res.send({
        status: 200,
        message: "Successfuly added technology",
        success: true,
        data: newTechnology,
      });
    } catch (error) {
      res.send(errorObj(error));
    }
  }

  static async Put(req, res) {
    try {
      let {
        name,
        img_link
      } = req.body;
      let {
        token
      } = req.headers;
      let {
        id
      } = JWT.VERIFY(token);
      let checkAdmin = await User.findById(id);
      if (checkAdmin.role != "admin") {
        throw new Error("Only admin can update!");
      }
      let findByIdTechnology = await Technologies.findById(req.params.id);
      if (findByIdTechnology == null) {
        throw new Error(`Not Found ${id} - technology`)
      }
      if (!name && !img_link) {
        throw new Error(`Not Found Target!`)
      }
      let updatedTechnology = await Technologies.findByIdAndUpdate(
        req.params.id, {
          name,
          img_link,
        }, {
          new: true
        }
      );

      console.log(updatedTechnology);

      res.send({
        status: 200,
        message: `Updated ${id} - technology`,
        success: true,
        data: updatedTechnology,
      });
    } catch (error) {
      res.send(errorObj(error));
    }
  }

  static async Delete(req, res) {
    try {
      let {
        token
      } = req.headers;
      let {
        id
      } = JWT.VERIFY(token);
      let checkAdmin = await User.findById(id);
      if (checkAdmin.role != "admin") {
        throw new Error("Only admin can delete!");
      }
      let deletedTechnology = await Technologies.findByIdAndDelete(
        req.params?.id
      );
      if (!deletedTechnology) {
        throw new Error(`Not Deleted ${req.params?.id} - technology`);
      }
      res.send({
        status: 200,
        message: "Deleted",
        success: true,
        data: deletedTechnology,
      });
    } catch (error) {
      res.send(errorObj(error));
    }
  }
}

export default TechnologyController;