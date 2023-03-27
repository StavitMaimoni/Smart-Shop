import mongoose from "mongoose";

// 1. Interface
export interface IContactModel extends mongoose.Document {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

// 2. Schema
export const ContactSchema = new mongoose.Schema<IContactModel>(
    {
        name: {
            type: String,
            required: [true, "Missing name"],
            minlength: [2, "Name too short"],
            maxlength: [100, "Name too long"],
            trim: true
        },
        email: {
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
        phone: {
            type: String,
            required: [true, "Missing phone number"],
            minlength: [9, "Phone number too short"],
            maxlength: [10, "Phone number too long"],
            trim: true
        },
        subject: {
            type: String,
            required: [true, "Missing subject"],
            minlength: [2, "Subject too short"],
            maxlength: [200, "Subject too long"],
            trim: true
        },
        message: {
            type: String,
            required: [true, "Missing message"],
            minlength: [2, "Message too short"],
            maxlength: [1000, "Message too long"],
            trim: true
        },
    },
    {
        versionKey: false,
        toJSON: { virtuals: true },
        id: false,
    }
);

// 3. Model
export const ContactModel = mongoose.model<IContactModel>("ContactModel", ContactSchema, "contacts");