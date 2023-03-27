import mongoose from "mongoose";

// 1. Interface
export interface ICategoryModel extends mongoose.Document {
    name: string;
}

// 2. Schema
export const CategorySchema = new mongoose.Schema<ICategoryModel>({
    name:{
        type:String,
        required:[true,"Missing category name"],
        minlength:[2,"Category too short"],
        maxlength:[100,"Category too long"],
        trim:true
    }
});

// 3. Model
export const CategoryModel = mongoose.model<ICategoryModel>("CategoryModel",CategorySchema, "categories");