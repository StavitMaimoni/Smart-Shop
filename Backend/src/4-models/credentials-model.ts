import mongoose from "mongoose";

// 1. Interface
export interface ICredentialsModel extends mongoose.Document {
    username: string;
    password: string;
}

// 2. Schema
export const CredentialsSchema = new mongoose.Schema<ICredentialsModel>({
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
    }
}, { autoCreate: false });

// 3. Model
export const CredentialsModel = mongoose.model<ICredentialsModel>("CredentialsModel", CredentialsSchema);
