import { UserModel } from "./user-model";

export class CartModel {
    _id:string;
    isClosed: boolean;
    createdAt: Date;
    user: UserModel;
    userId: string;
}