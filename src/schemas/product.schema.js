import { Schema, model, Types } from "mongoose";



const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    technology: [
      {
        type: Types.ObjectId,
        ref: "technologies",
        required: true,
      },
    ],
    user: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
    category: {
      type: String
    },
    product_link: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
    },
    price: {
      type: String,
    },
    github_link: {
      type: String,
    },
    phone_number: {
      type: String,
      $regex: "+3367197",
      $options: "i",
      $in: [/^\+?[\d\. ]+/],
    },
  },
  {
    timestamps: true,
  }
);

export default model("products", ProductSchema);
