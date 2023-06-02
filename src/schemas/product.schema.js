import { Schema, model, Types } from "mongoose";

const technologyArr = [
  "free",
  "premiuim",
  "blog",
  "boilerplate",
  "business",
  "dashboard",
  "documentation",
  "ecommerce",
  "portfolio",
  "sass",
];

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
      type: String,
      set(value) {
        if (!technologyArr.includes(value?.toLowerCase())) {
          throw new Error(`Invalid technology ❌`);
        }
      },
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

ProductSchema.index({
  name: "text",
  technology: "text",
  price: "text",
  desc: "text",
  github_link: "text",
  product_link: "text",
});

export default model("products", ProductSchema);
