import { createStore } from "redux";
import { ProductModel } from "src/app/models/product-model";


// 1. Global State - the global data:
export class ProductsState {
    public products: ProductModel[] = [];
}

// 2. Action Type - a list of operations we can perform on the data:
export enum ProductsActionType {
    FetchProducts = "FetchProducts",
    AddProduct = "AddProduct",
    DeleteProduct = "DeleteProduct",
    UpdateProduct = "UpdateProduct",
}

// 3. Action - A single object which dispatch sends to Redux for some change:
export interface ProductsAction {
    type: ProductsActionType;
    payload: any;
}

// 4. Reducer - a function which will be invoked when calling dispatch to perform the operation
export function productsReducer(currentState = new ProductsState(), action: ProductsAction): ProductsState {
    const newState = { ...currentState };

    switch (action.type) {
        case ProductsActionType.FetchProducts: // Here the payload is a list of products (ProductModel[])
            newState.products = action.payload;
            break;
        case ProductsActionType.AddProduct: // Here the payload is a product to add (ProductModel)
            newState.products.push(action.payload);
            break;
        case ProductsActionType.UpdateProduct: // Here the payload is a product to update (ProductModel)
            const indexToUpdate = newState.products.findIndex(p => p._id === action.payload._id);
            if (indexToUpdate >= 0) newState.products[indexToUpdate] = action.payload;
            break;
        case ProductsActionType.DeleteProduct: // Here the payload is the id of the product to delete (number)
            const indexToDelete = newState.products.findIndex(p => p._id === action.payload);
            newState.products.splice(indexToDelete, 1);
            break;
    }

    return newState;
}

// 5. Store - manager object from Redux library which handles the entire operation:
export const productsStore = createStore(productsReducer);


