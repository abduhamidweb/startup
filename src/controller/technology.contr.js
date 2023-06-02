import Technologies from "../schemas/technology.schema.js";
import Products from "../schemas/product.schema.js";
import { JWT } from "../utils/jwt.js";
import {User} from "../schemas/user.schema.js";

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
      let { id } = req.params;
      let { name } = req.query;
      if (id) {
        let data = await Products.find({ technology: id })
          .populate("technology")
          .populate("user");
        res.send({
          status: 200,
          message: `${id} - technology products`,
          success: true,
          data: data,
        });
      } else if (name) {
        let findByNameCat = await Technologies.findOne({ name });
        let allData = await Products.find()
          .populate("technology")
          .populate("user");
        let data = await allData.filter((el) => {
          return el.technology.name == name;
        });
        res.send({
          status: 200,
          message: `${id} - technology products`,
          success: true,
          data: data,
        });
      } else {
        res.send({
          status: 200,
          message: "All Technologies",
          success: true,
          data: await Technologies.find(),
        });
      }
    } catch (error) {
      res.send(errorObj(error));
    }
  }

  static async Post(req, res) {
    try {
      let { name, img_link } = req.body;
      let { token } = req.headers;
      let { id } = JWT.VERIFY(token);
      let checkAdmin = await User.findById(id);
      if (checkAdmin.role != "admin") {
        throw new Error("Only admin can add!");
      }
      let newTechnology = await Technologies.create({ name, img_link });
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
      let { name, img_link } = req.body;
      let { token } = req.headers;
      let { id } = JWT.VERIFY(token);
      let checkAdmin = await User.findById(id);
      if (checkAdmin.role != "admin") {
        throw new Error("Only admin can update!");
      }
      let updatedTechnology = await Technologies.findByIdAndUpdate(req.params?.id, {
        name,
        img_link,
      });
      console.log(updatedTechnology);
      if (!updatedTechnology) {
        throw new Error(`Not Update technology`);
      }
      res.send({
        status: 200,
        message: `Updated ${id} - technology`,
        success: true,
        data: await Technologies.findById(req.params?.id),
      });
    } catch (error) {
      res.send(errorObj(error));
    }
  }

  static async Delete(req, res) {
    try {
      let { token } = req.headers;
      let { id } = JWT.VERIFY(token);
      let checkAdmin = await User.findById(id);
      if (checkAdmin.role != "admin") {
        throw new Error("Only admin can delete!");
      }
      let deletedTechnology = await Technologies.findByIdAndDelete(req.params?.id);
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
