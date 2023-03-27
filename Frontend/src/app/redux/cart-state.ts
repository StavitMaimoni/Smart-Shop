import { createStore } from "redux";
import { ProductModel } from "src/app/models/product-model";


// 1. Global State - the global data:
export class CartState {
    public products: ProductModel[] = [];
    public cartId:string;
}

// 2. Action Type - a list of operations we can perform on the data:
export enum CartActionType {
    FetchProducts = "FetchProducts",
    AddProduct = "AddProduct",
    DeleteProduct = "DeleteProduct",
    UpdateProduct = "UpdateProduct",
}

// 3. Action - A single object which dispatch sends to Redux for some change:
export interface CartAction {
    type: CartActionType;
    payload: any;
}

// 4. Reducer - a function which will be invoked when calling dispatch to perform the operation
export function cartReducer(currentState = new CartState(), action: CartAction): CartState {
    const newState = { ...currentState };

    switch (action.type) {

        case CartActionType.FetchProducts: // Here the payload is a list of total (ProductModel[])
            newState.products = action.payload;
            break;
        case CartActionType.AddProduct: // Here the payload is a product to add (ProductModel)
            const indexToAdd = newState.products.findIndex(p => p._id === action.payload._id);
            if (indexToAdd) newState.products.push(action.payload);
            break;
        case CartActionType.DeleteProduct: // Here the payload is the id of the product to delete (number)
            const indexToDelete = newState.products.findIndex(p => p._id === action.payload);
            if (indexToDelete > -1) newState.products.splice(indexToDelete, 1);
            break;
        case CartActionType.UpdateProduct: // Here the payload is a product to update (ProductModel)
            const indexToUpdate = newState.products.findIndex(p => p._id === action.payload._id);
            if (indexToUpdate >= 0) newState.products[indexToUpdate] = action.payload;
            break; 
    }

    return newState;
}

// 5. Store - manager object from Redux library which handles the entire operation:
export const cartStore = createStore(cartReducer);


