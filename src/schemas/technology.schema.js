import { Schema, model, Types } from "mongoose";

const technologySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    img_link: {
      type: String,
      required : true
    },
  },
  {
    timestamps: true,
  }
);

export default model('technologies',technologySchema);
