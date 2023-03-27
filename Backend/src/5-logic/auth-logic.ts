import cyber from "../3-middleware/cyber";
import { ICityModel, CityModel } from "../4-models/city-model";
import { ICredentialsModel } from "../4-models/credentials-model";
import { UnauthorizedErrorModel, ValidationErrorModel } from "../4-models/error-models";
import { IUserModel, UserModel } from "../4-models/user-model";

async function register(user: IUserModel): Promise<string> {
    const errors = user.validateSync();
    if (errors) throw new ValidationErrorModel(errors.message);

    // Check if userName taken:
    const existingUser = await UserModel.findOne({ username: user.username });
    if (existingUser)
        throw new ValidationErrorModel(
            `Sorry the username ${user.username} is already taken, please try another username`
        );

    // Check if identity card taken:
    const existingIdentityCard = await UserModel.findOne({ identityCard: user.identityCard });
    if (existingIdentityCard)
        throw new ValidationErrorModel(
            `Sorry the identity card ${user.identityCard} is already taken, please write another identity card`
        );

    // Hash password:
    user.password = cyber.hash(user.password);

    // Create a new user instance:
    const newUser = new UserModel(user);

    // Inserts the registered user into the database.
    const insertedUser = await newUser.save();
    user._id = insertedUser._id;


    // Create new token:
    const token = cyber.getNewToken(insertedUser);
    return token;
}

async function login(credentials: ICredentialsModel): Promise<string> {
    // Verifies if the user's credentials are correct. If the username or password are incorrect, an error message is thrown.
    const error = credentials.validateSync();
    if (error) throw new ValidationErrorModel(error.message);

    // Hash password:
    credentials.password = cyber.hash(credentials.password);

    // Gets all the details of the user from the database.
    const user = await UserModel.findOne({
        username: credentials.username,
        password: credentials.password
    });

    // If the user is not found in the database an error message is thrown.
    if (!user) throw new UnauthorizedErrorModel("Incorrect username or password");

    // Create new token: 
    // Generates a JWT token to use as authentication when accessing protected resources on this server.
    const token = cyber.getNewToken(user);
    return token;
}

// Get all cities: 
async function getAllCities(): Promise<ICityModel[]> {
    return CityModel.find().exec();
}

export default {
    register,
    login,
    getAllCities
}