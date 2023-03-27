import { CartModel } from "./cart-model";
import { UserModel } from "./user-model";

export class OrderModel {
    shipCity: string;
    shipStreet: string;
    shipDate: Date;
    createdAt: Date;
    creditCard: string;
    finalPrice: number;
    user: UserModel;
    userId: string;
    cart: CartModel;
    cartId: string;
}
 