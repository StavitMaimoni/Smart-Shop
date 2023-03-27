import mongoose from "mongoose";
import { CategoryModel } from "./category-model";
import { UploadedFile } from "express-fileupload";

// 1. Interface
export interface IProductModel extends mongoose.Document {
    name: string;
    price: number;
    quantity: number;
    imageName: string;
    image: UploadedFile;
    categoryId: mongoose.Schema.Types.ObjectId;
}

// 2. Schema
export const ProductSchema = new mongoose.Schema<IProductModel>({
    name: {
        type: String,
        required: [true, "Missing product name"],
        minlength: [2, "Product name too short"],
        maxlength: [60, "Product name too long"],
        trim: true
    },
    price: {
        type: Number,
        required: [true, "Missing product price"],
        min: [1, "Price needs to be grater than zero"],
        trim: true
    },
    quantity: {
        type: Number,
        pattern: "^0$",
        min: [0, "Quantity can't be negative"],
        trim: true
    },
    image: {
        type: Object
    },
    imageName: {
        type: String,
        required: [true, "Missing image name"],
        trim: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId
    }
}, {
    versionKey: false,
    toJSON: { virtuals: true },
    id: false
});

ProductSchema.virtual("categories", {
    ref: CategoryModel,
    localField: "categoryId",
    foreignField: "_id",
    justOne: true
}
);

// 3. Model
export const ProductModel = mongoose.model<IProductModel>("ProductModel", ProductSchema, "products");