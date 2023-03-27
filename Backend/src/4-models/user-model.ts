import mongoose, { Schema, Document, Model } from "mongoose";
import { RoleModel } from "./role-model";

export interface IUserModel extends Document {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    role: RoleModel;
    identityCard: number;
    street: string;
    cityId: Schema.Types.ObjectId;
}

const UserSchema: Schema<IUserModel> = new Schema(
    {
        firstName: {
            type: String,
            required: [true, "Missing first name"],
            minlength: [2, "First name too short"],
            maxlength: [30, "First name too long"],
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, "Missing last name"],
            minlength: [2, "Last name too short"],
            maxlength: [30, "Last name too long"],
            trim: true,
        },
        username: {
            type: String,
            required: [true, "Missing username"],
            minlength: [6, "Email too short"],
            maxlength: [255, "Email too long"],
            trim: true,
            unique: true,
            lowercase: true,
            validate: {
                validator: function (v: string) {
                    return /^\S+@\S+\.\S+$/.test(v);
                },
                message: "Email address is invalid",
            },
        },
        password: {
            type: String,
            required: [true, "Missing password"],
            trim: true,
        },
        role: {
            type: String,
            trim: true,
        },
        identityCard: {
            type: Number,
            required: [true, "Missing identity card"],
            pattern: "^[0-9]{9}$",
            min: [100000000, "Identity card must contain only 9 digits"],
            max: [999999999, "Identity card must contain only 9 digits"],
            trim: true,
            unique: true,
        },
        street: {
            type: String,
            required: [true, "Missing street"],
            minlength: [2, "Street too short"],
            maxlength: [50, "Street too long"],
            trim: true,
        },
        cityId: {
            type: Schema.Types.ObjectId,
            ref: "CityModel",
            required: [true, "Missing city"],
        },
    },
    {
        versionKey: false,
        toJSON: { virtuals: true },
        id: false,
    }
);

UserSchema.virtual("cities", {
    ref: "CityModel",
    localField: "cityId",
    foreignField: "_id",
    justOne: true,
});

export const UserModel: Model<IUserModel> = mongoose.model<IUserModel>("UserModel", UserSchema,"users");
