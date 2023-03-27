import mongoose from "mongoose";
import { CartModel } from "./cart-model";
import { UserModel } from "./user-model";

// 1. Interface
export interface IOrderModel extends mongoose.Document {
    shipCity: string;
    shipStreet: string;
    shipDate: Date;
    createdAt: Date;
    creditCard: number;
    finalPrice: number;
    userId: mongoose.Schema.Types.ObjectId;
    cartId: mongoose.Schema.Types.ObjectId;
}

// 2. Schema
export const OrderSchema = new mongoose.Schema<IOrderModel>({
    shipCity: {
        type: String,
        required: [true, "City is required"],
        minlength: [2, "City name too short"],
        maxlength: [100, "City name too long"],
        trim: true
    },
    shipStreet: {
        type: String,
        required: [true, "Shipping street is required"],
        minlength: [2, "Street name too short"],
        maxlength: [100, "Street name too long"],
        trim: true
    },
    shipDate: {
        type: Date,
        required: [true, "Ship date is required"],
    },
    createdAt: {
        type: Date,
    },
    creditCard: {
        type: Number,
        required: [true, "Last 4 digits of credit card number is required"],
        pattern: "^[0-9]{4}$",
        min: [1111, "Need only last 4 digits of credit card number"],
        max: [9999, "Need only last 4 digits of credit card number"],
        trim: true
    },
    finalPrice: {
        type: Number,
        required: [true, "final price is required"],
        min: [0, "final price can't be negative"],
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId
    },
    cartId: {
        type: mongoose.Schema.Types.ObjectId
    }
}, {
    versionKey: false,
    toJSON: { virtuals: true },
    id: false
});

OrderSchema.virtual("users", {
    ref: UserModel,
    localField: "userId",
    foreignField: "_id",
    justOne: true
});

OrderSchema.virtual("carts", {
    ref: CartModel,
    localField: "cartId",
    foreignField: "_id",
    justOne: true
});

// 3. Model
export const OrderModel = mongoose.model<IOrderModel>("OrderModel", OrderSchema, "orders");