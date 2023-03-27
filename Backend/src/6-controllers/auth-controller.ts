import express, { Request, Response, NextFunction } from "express";
import { CredentialsModel } from "../4-models/credentials-model";
import { UserModel } from "../4-models/user-model";
import authLogic from "../5-logic/auth-logic";

// Create router object to be exported at the end of the file.
const router = express.Router();

// POST http://localhost:3001/api/auth/register
router.post("/auth/register", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const user = new UserModel(request.body); // Create an instance of UserModel passing request body as argument
        console.log(user);
        
        const token = await authLogic.register(user); // Invoke register() method on authLogic passing the user instance as an argument which returns an Auth Token
        response.status(201).json(token); // Send status code 201 indicating that resource was created successfully along with token returned by register() method          
    }
    catch (err: any) { // Catch possible errors thrown during execution
        next(err);
    }
});

// POST http://localhost:3001/api/auth/login
router.post("/auth/login", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const credentials = new CredentialsModel(request.body); //Take credentials from the request body (username & password)
        const token = await authLogic.login(credentials);//Passes credentials into the login method of authLogic,and returns an authentication token if login was successful
        response.json(token);//Sending back token within response object
    }
    catch (err: any) {// Catch possible errors thrown during execution
        next(err);
    }
});

// GET http://localhost:3001/api/cities --Get all cities
router.get("/cities", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const cities = await authLogic.getAllCities();
        response.json(cities);
    }
    catch (err: any) {
        next(err);
    }
});

export default router;
