import { CartModel, ICartModel } from "../4-models/cart-model";
import { CategoryModel, ICategoryModel } from "../4-models/category-model";
import { ResourceNotFoundErrorModel, ValidationErrorModel } from "../4-models/error-models";
import { IItemModel, ItemModel } from "../4-models/item-cart-model";
import { IOrderModel } from "../4-models/order-model";
import { IProductModel, ProductModel } from "../4-models/product-model";
import { v4 as uuid } from "uuid"; // v4 function changed to uuid name.
import { IContactModel } from "../4-models/contact-model";


// Get all categories: 
async function getAllCategories(): Promise<ICategoryModel[]> {
    return CategoryModel.find().exec();
}

// Get all products: 
async function getAllProducts(): Promise<IProductModel[]> {
    return ProductModel.find().exec();
}

// Get products by category: 
async function getProductsByCategory(categoryId: string): Promise<IProductModel[]> {
    return ProductModel.find({ categoryId }).populate("categories").exec();
}

// Get item cart by user: 
async function getItemByUser(userId: string): Promise<IItemModel[]> {
    return ItemModel.find({ userId }).populate("users").exec();
}

// Add new cart: 
async function addNewCart(cart: ICartModel): Promise<ICartModel> {
    const errors = cart.validateSync();
    if (errors) throw new ValidationErrorModel(errors.message);
    return cart.save();
}

// Add item to cart: 
async function addItemCart(item: IItemModel): Promise<IItemModel> {
    const errors = item.validateSync();
    if (errors) throw new ValidationErrorModel(errors.message);
    return item.save();
}

// Update item-cart:
async function updateItem(item: IItemModel): Promise<IItemModel> {
    const errors = item.validateSync();
    if (errors) throw new ValidationErrorModel(errors.message);
    const updatedItem = await ItemModel.findByIdAndUpdate(item._id, item, { returnOriginal: false }).exec();
    if (!updatedItem) throw new ResourceNotFoundErrorModel(item._id);
    return updatedItem;
}

// Get cart by userId: 
async function getCartByUser(userId: string): Promise<ICartModel[]> {
    return CartModel.find({ userId }).populate("users").exec();
}

// Remove item from cart: 
async function removeItemCart(itemId: string): Promise<void> {
    const item = await ItemModel.findById(itemId);
    const product = await ProductModel.findById(item.productId);
    product.quantity = 0;
    await ProductModel.findByIdAndUpdate(product._id, product, { returnOriginal: false }).exec();
    const deletedItem = await ItemModel.findByIdAndDelete(itemId);
    if (!deletedItem) throw new ResourceNotFoundErrorModel(itemId);
}

//Close cart:
async function closeCart(id: string, cart: ICartModel): Promise<void> {
    const errors = cart.validateSync();
    if (errors) throw new ValidationErrorModel(errors.message);
    const updatedCart = await CartModel.findByIdAndUpdate(id, { isClosed: true }, { new: true }).exec();
    if (!updatedCart) throw new ResourceNotFoundErrorModel(id);
}

// Add product: 
async function addProduct(product: IProductModel): Promise<IProductModel> {
    const errors = product.validateSync();
    if (errors) throw new ValidationErrorModel(errors.message);
    if (!product.image) throw new ValidationErrorModel("Product image is required");
    const extension = product.image.name.substring(product.image.name.lastIndexOf("."))
    product.imageName = uuid() + extension;
    await product.image.mv("./src/1-assets/images/" + product.imageName);
    delete product.image;
    product.quantity = 0;
    return product.save();
}

// Update product:
async function updateProduct(product: IProductModel): Promise<IProductModel> {
    const errors = product.validateSync();
    if (errors) throw new ValidationErrorModel(errors.message);
    if (product.image) {
        await product.image.mv("./src/1-assets/images/" + product.imageName);
        delete product.image;
    }
    const updatedProduct = await ProductModel.findByIdAndUpdate(product._id, product, { returnOriginal: false }).exec();
    if (!updatedProduct) throw new ResourceNotFoundErrorModel(product._id);
    return updatedProduct;
}

//Save order details:
async function saveOrderDetails(order: IOrderModel): Promise<void> {
    const errors = order.validateSync();
    if (errors) throw new ValidationErrorModel(errors.message);
    order.save()
}

//Save user message:
async function addContact(contact: IContactModel): Promise<void> {
    const errors = contact.validateSync();
    if (errors) throw new ValidationErrorModel(errors.message);
    contact.save()
}

export default {
    getAllCategories,
    getAllProducts,
    getProductsByCategory,
    addProduct,
    updateProduct,
    addNewCart,
    addItemCart,
    removeItemCart,
    closeCart,
    getCartByUser,
    getItemByUser,
    updateItem,
    saveOrderDetails,
    addContact
};