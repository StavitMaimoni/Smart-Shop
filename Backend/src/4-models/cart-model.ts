import mongoose from "mongoose";
import { UserModel } from "./user-model";

// 1. Interface
export interface ICartModel extends mongoose.Document {
    isClosed: boolean;
    createdAt: Date;
    userId: mongoose.Schema.Types.ObjectId;
}

// 2. Schema
export const CartSchema = new mongoose.Schema<ICartModel>({
    isClosed:{
        type:Boolean,
        required:[true,"Missing whether the cart was closed or not"],
        trim:true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId
    }
},{
    versionKey: false,
    toJSON: { virtuals: true},
    id: false
});

CartSchema.virtual("users", {
    ref: UserModel,
    localField: "userId",
    foreignField: "_id",
    justOne: true
});

// 3. Model
export const CartModel = mongoose.model<ICartModel>("CartModel",CartSchema, "carts");