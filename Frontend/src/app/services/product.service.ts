import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { authStore } from 'src/app/redux/auth-state';
import { cartStore, CartActionType } from 'src/app/redux/cart-state';
import { ProductsActionType, productsStore } from 'src/app/redux/products-state';
import { CartModel } from '../models/cart-model';
import { CategoryModel } from '../models/category-model';
import { ContactModel } from '../models/contact-model';
import { ItemModel } from '../models/item-cart-model';
import { OrderModel } from '../models/order-model';
import { ProductModel } from '../models/product-model';
import { appConfig } from '../utils/app-config';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    public cart = new CartModel();
    public order = new OrderModel();
    public addedCartID: string;
    public userId: string;

    public constructor(private http: HttpClient) { }

    // Get all categories:
    public async getAllCategories(): Promise<CategoryModel[]> {
        const observable = this.http.get<CategoryModel[]>(appConfig.categoriesUrl);
        const categories = await firstValueFrom(observable);
        return categories;
    }

    // Get all products:
    public async getAllProducts(): Promise<ProductModel[]> {
        const observable = this.http.get<ProductModel[]>(appConfig.productsUrl);
        const products = await firstValueFrom(observable);
        return products;
    }

    // Get products by category:
    public async getProductsByCategory(categoryId: string): Promise<ProductModel[]> {
        const observable = this.http.get<ProductModel[]>(appConfig.productsByCategoryUrl + categoryId);
        const products = await firstValueFrom(observable);
        return products;
    }

    // Get cart by userId:
    public async getCartByUser(): Promise<CartModel> {
        this.userId = authStore.getState().user._id;
        const observable1 = this.http.get<CartModel[]>(appConfig.cartByUserUrl + this.userId);
        const cart = await firstValueFrom(observable1);
        return cart[0];
    }


    // Get item by user:
    public async getItemByUser(): Promise<ItemModel[]> {
        this.userId = authStore.getState().user._id;
        const observable = this.http.get<ItemModel[]>(appConfig.itemByUserUrl + this.userId);
        const items = await firstValueFrom(observable);
        return items;
    }

    // Add cart:
    public async addCart(): Promise<void> {
        this.cart.isClosed = false;
        this.cart.createdAt = new Date();
        this.cart.userId = authStore.getState().user._id;
        const observable = this.http.post<CartModel>(appConfig.cartsUrl, this.cart);
        const response = await firstValueFrom(observable);
        this.addedCartID = response._id;
    }

    //Close cart
    public async closeCart(): Promise<void> {
        this.userId = authStore.getState().user._id;
        const observable1 = this.http.get<CartModel[]>(appConfig.cartByUserUrl + this.userId);
        const cart = await firstValueFrom(observable1);
        const observable2 = this.http.put<CartModel>(appConfig.cartsUrl + cart[0]._id, { isClosed: true });
        await firstValueFrom(observable2);
    }

    // Add item:
    public async addItem(product: ProductModel): Promise<void> {
        let item: ItemModel = new ItemModel();
        item.quantity = product.quantity;
        item.total = product.quantity * product.price;
        item.productId = product._id;
        item.userId = authStore.getState().user._id;
        const cart = (await this.getCartByUser());
        item.cartId = cart._id;
        const findInStore = cartStore.getState().products.findIndex(p => p._id === product._id);
        if (findInStore < 0) {
            cartStore.dispatch({ type: CartActionType.AddProduct, payload: product });
            const observable = this.http.post<ItemModel>(appConfig.itemUrl, item);
            await firstValueFrom(observable);
        }
        else {
            let itemsArr = await this.getItemByUser();
            let findItem = itemsArr.find(p => p.productId === product._id);
            item._id = findItem._id;
            cartStore.dispatch({ type: CartActionType.UpdateProduct, payload: product });
            const observable = this.http.put(appConfig.itemUrl, item);
            await firstValueFrom(observable);
        }
    }

    // Delete item:
    public async deleteItem(id: string): Promise<void> {
        const itemsArr = await this.getItemByUser();
        const findItem = itemsArr.find(p => p.productId === id);
        const itemId = findItem._id;
        const observable = this.http.delete(appConfig.itemUrl + itemId);
        await firstValueFrom(observable);
    }

    public async emptyCart() {
        const cartItems = await this.getItemByUser();
        const allProducts = await this.getAllProducts();
        for (let i = (cartItems.length) - 1; i > -1; i--) {
            let cartItem = cartItems[i];
            let productToUpdate = allProducts.find(p => p._id === cartItem.productId);
            productToUpdate.quantity = 0;
            productsStore.dispatch({ type: ProductsActionType.UpdateProduct, payload: productToUpdate });
            this.updateProduct(productToUpdate);
            this.deleteItem(cartItem.productId);
            cartStore.dispatch({ type: CartActionType.DeleteProduct, payload: cartItem.productId });
        }

    }

    public async addProduct(product: ProductModel): Promise<ProductModel> {
        const myFormData = new FormData();
        myFormData.append("name", product.name);
        myFormData.append("imageName", product.imageName);
        myFormData.append("categoryId", product.categoryId);
        myFormData.append("quantity", product.quantity ? product.quantity.toString() : "");
        myFormData.append("price", product.price ? product.price.toString() : "");

        if (product.image) {
            myFormData.append('image', product.image[0]);
        }

        const observable = this.http.post<ProductModel>(appConfig.productsUrl, myFormData);
        const addedProduct = await firstValueFrom(observable);

        productsStore.dispatch({ type: ProductsActionType.AddProduct, payload: addedProduct });
        return addedProduct;
    }

    // Update product:
    public async updateProduct(product: ProductModel): Promise<void> {
        const myFormData = new FormData();
        myFormData.append("name", product.name);
        myFormData.append("imageName", product.imageName);
        myFormData.append("categoryId", product.categoryId);
        myFormData.append("quantity", product.quantity ? product.quantity.toString() : "");
        myFormData.append("price", product.price ? product.price.toString() : "");

        if (product.image) {
            myFormData.append('image', product.image[0]);
        }
        const observable = this.http.put(appConfig.productsUrl + product._id, myFormData);
        const updatedProduct = await firstValueFrom(observable);

        productsStore.dispatch({ type: ProductsActionType.UpdateProduct, payload: updatedProduct });
    }

    // Save order details:
    public async saveOrderDetails(order:OrderModel): Promise<void> {
        this.order.shipCity=order.shipCity;
        this.order.shipStreet=order.shipStreet;
        this.order.shipDate=order.shipDate;
        this.order.finalPrice=order.finalPrice;
        this.order.creditCard=order.creditCard.substr(-4);
        this.order.createdAt = new Date();
        this.order.userId = authStore.getState().user._id;
        this.order.cartId=this.cart._id;
        const observable = this.http.post<OrderModel>(appConfig.orderUrl, this.order);
        await firstValueFrom(observable);
    }

    // Save user message:
    public async saveUserMessage(contact:ContactModel): Promise<void> {
        const observable = this.http.post<OrderModel>(appConfig.contactUrl, contact);
        await firstValueFrom(observable);
    }
}
