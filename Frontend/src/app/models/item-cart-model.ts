import { CartModel } from "./cart-model";
import { ProductModel } from "./product-model";
import { UserModel } from "./user-model";

export class ItemModel {
    _id:string;
    quantity: number;
    total: number;
    product: ProductModel;
    productId: string;
    cart: CartModel;
    cartId: string;
    userId: string;
    user:UserModel;
}
