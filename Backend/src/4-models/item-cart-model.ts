import mongoose from "mongoose";
import { CartModel } from "./cart-model";
import { ProductModel } from "./product-model";

// 1. Interface
export interface IItemModel extends mongoose.Document {
    quantity:number;
    total: number;
    productId: mongoose.Schema.Types.ObjectId;
    cartId: mongoose.Schema.Types.ObjectId;
    userId: mongoose.Schema.Types.ObjectId;
}

// 2. Schema
export const ItemSchema = new mongoose.Schema<IItemModel>({
    quantity:{
        type:Number,
        required:[true,"Missing item's quantity"],
        min:[0,"Item's quantity can't be negative"],
        trim:true
    },
    total:{
        type:Number,
        required:[true,"Missing total price"],
        min:[0,"Total price can't be negative"],
        trim:true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId
    },
    cartId: {
        type: mongoose.Schema.Types.ObjectId
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId
    }
},{
    versionKey: false,
    toJSON: { virtuals: true},
    id: false
});

ItemSchema.virtual("products", {
    ref: ProductModel,
    localField: "productId",
    foreignField: "_id",
    justOne: true
});
ItemSchema.virtual("carts", {
    ref: CartModel,
    localField: "cartId",
    foreignField: "_id",
    justOne: true
});
ItemSchema.virtual("users", {
    ref: CartModel,
    localField: "userId",
    foreignField: "_id",
    justOne: true
});

// 3. Model
export const ItemModel = mongoose.model<IItemModel>("ItemModel",ItemSchema, "items");