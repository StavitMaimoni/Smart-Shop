import { Request } from "express";
import jwt from "jsonwebtoken";
import { IUserModel, UserModel } from "../4-models/user-model";
import crypto from "crypto";
import { RoleModel } from "../4-models/role-model";

// Create secret key ==> a string for our REST API
const secretKey = "BlueOwl";

function getNewToken(user: IUserModel): string {

    // Never return passwords to frontend!
    delete user.password;

    // Create a container for the user object:
    const container = { user };

    // Create expiration time:
    const options = { expiresIn: "3h" };

    // Generate token:
    const token = jwt.sign(container, secretKey, options);

    return token;
}

function verifyToken(request: Request): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => { // To Promisify
        try {

            // Token format inside a header named authorization: 
            // "Bearer the-token"
            //  01234567

            // Extract header: 
            const header = request.header("authorization");

            // If no such header: 
            if (!header) {
                resolve(false);
                return;
            }

            // Extract token from header: 
            const token = header.substring(7);

            // If there is no token: 
            if (!token) {
                resolve(false);
                return;
            }

            // Verify token:
            jwt.verify(token, secretKey, err => {

                // If token is illegal:
                if (err) {
                    resolve(false);
                    return;
                }

                // Here token must be legal:
                resolve(true);

            });

        }
        catch (err: any) {
            reject(err);
        }

    });
}

const salt = "SecurePassword";

function hash(plainText: string): string {

    if (!plainText) return null;

    // Hash without salt:
    // const hashedText = crypto.createHash("sha512").update(plainText).digest("hex");

    // Hash with salt: 
    const hashedText = crypto.createHmac("sha512", salt).update(plainText).digest("hex");

    return hashedText;

    // SHA - Secure Hashing Algorithm
    // HMAC - Hash based Message Authentication Code
}

async function verifyAdmin(request: Request): Promise<boolean> {

    // First check if user logged in:
    const isLoggedIn = await verifyToken(request);

    // If not logged in:
    if (!isLoggedIn) return false;

    // Extract token: 
    const header = request.header("authorization");
    const token = header.substring(7);

    // Extract container from token:
    const container: any = jwt.decode(token);

    // Extract user id: 
    const userId = container.user;

    // Retrieve the user document from the database:
    const user = await UserModel.findById(userId).exec();

    // Return true if user is admin, otherwise return false:
    return user.role === RoleModel.Admin;
}

export default {
    getNewToken,
    verifyToken,
    verifyAdmin,
    hash
};
