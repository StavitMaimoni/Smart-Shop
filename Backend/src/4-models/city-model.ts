import mongoose from "mongoose";

// 1. Interface
export interface ICityModel extends mongoose.Document {
    name: string;
}

// 2. Schema
export const CitySchema = new mongoose.Schema<ICityModel>({
    name:{
        type:String,
        required:[true,"Missing city name"],
        minlength:[2,"City name too short"],
        maxlength:[100,"City name too long"],
        trim:true
    }
});

// 3. Model
export const CityModel = mongoose.model<ICityModel>("CityModel",CitySchema, "cities");