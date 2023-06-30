import mongoose from "mongoose";
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    categoryname: {
        type: String,
        required: true,
        unique: true
    }
});

const Category = mongoose.model('Category', categorySchema);
export default Category