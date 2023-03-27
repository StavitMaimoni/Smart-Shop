import express, { Request, Response, NextFunction } from "express";
import { ProductModel } from "../4-models/product-model";
import productsLogic from "../5-logic/products-logic";
import path from "path";
import { ItemModel } from "../4-models/item-cart-model";
import { CartModel } from "../4-models/cart-model";
import verifyAdmin from "../3-middleware/verify-admin";
import { OrderModel } from "../4-models/order-model";
import { ContactModel } from "../4-models/contact-model";

interface RequestWithFiles extends Request {
    files?: any;
  }

const router = express.Router();// Create router object to be exported at the end of the file. 

// GET http://localhost:3001/api/categories --Get all categories
router.get("/categories", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const categories = await productsLogic.getAllCategories();
        response.json(categories);
    }
    catch (err: any) {
        next(err);
    }
});

// GET http://localhost:3001/api/products -- Get all products
router.get("/products", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const products = await productsLogic.getAllProducts();
        response.json(products);
    }
    catch (err: any) {
        next(err);
    }
});

// GET http://localhost:3001/api/products-by-category/:categoryId -- Get products by category
router.get("/products-by-category/:categoryId", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const categoryId = request.params.categoryId;
        const products = await productsLogic.getProductsByCategory(categoryId);
        response.json(products);
    }
    catch (err: any) {
        next(err);
    }
});

// GET http://localhost:3001/api/cart-by-user/:userId -- Get cart by userId
router.get("/cart-by-user/:userId", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userId = request.params.userId;
        const cart = await productsLogic.getCartByUser(userId);
        response.json(cart);
    }
    catch (err: any) {
        next(err);
    }
});


// GET http://localhost:3001/api/item-by-user/:userId -- Get item-cart by userId
router.get("/item-by-user/:userId", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userId = request.params.userId;
        const item = await productsLogic.getItemByUser(userId);
        response.json(item);
    }
    catch (err: any) {
        next(err);
    }
});

// POST http://localhost:3001/api/cart -- Add new cart
router.post("/cart", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const cart = new CartModel(request.body);
        const addedCart = await  productsLogic.addNewCart(cart);
        response.status(201).json(addedCart);
    }
    catch (err: any) {
        next(err);
    }
});

// PUT http://localhost:3001/api/cart   -- Close cart:
router.put("/cart/:id", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const cart = new CartModel(request.body);
        const updatedCart = await productsLogic.closeCart(request.params.id, cart);
        response.json(updatedCart);
    } catch (err: any) {
        next(err);
    }
});


// POST http://localhost:3001/api/item -- Add item to cart
router.post("/item", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const item = new ItemModel(request.body);
        const addedItem = await  productsLogic.addItemCart(item);
        response.status(201).json(addedItem);
    }
    catch (err: any) {
        next(err);
    }
});

// PUT http://localhost:3001/api/item -- Update item-cart
router.put("/item", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const item = new ItemModel(request.body);
        const updatedItem = await productsLogic.updateItem(item);
        response.json(updatedItem);
    }
    catch (err: any) {
        next(err);
    }
});

// DELETE http://localhost:3001/api/item/:_id --Remove item from cart
router.delete("/item/:_id", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const _id = request.params._id;
        await productsLogic.removeItemCart(_id);
        response.sendStatus(204);
    }
    catch (err: any) {
        next(err);
    }
});

// POST http://localhost:3001/api/products -- Add new product
router.post("/products",verifyAdmin, async (request: RequestWithFiles, response: Response, next: NextFunction) => {
    try {
        request.body.image = request.files?.image;
        const product = new ProductModel(request.body);
        const addedProduct = await  productsLogic.addProduct(product);
        response.status(201).json(addedProduct);
    }
    catch (err: any) {
        next(err);
    }
});

// PUT http://localhost:3001/api/products/:_id -- Update product
router.put("/products/:_id", async (request: RequestWithFiles, response: Response, next: NextFunction) => {
    try {
        request.body._id = request.params._id;
        request.body.image = request.files?.image;
        const product = new ProductModel(request.body);
        const updatedProduct = await productsLogic.updateProduct(product);
        response.json(updatedProduct);
    }
    catch (err: any) {
        next(err);
    }
});

// GET http://localhost:3001/api/product/images/:imageName-- Get image by image name
router.get("/product/images/:imageName", async (request: Request, response: Response, next: NextFunction) => {
    try {
        // __dirname contains the full path to our current folder - controllers folder
        const imageName = request.params.imageName;
        const absolutePath = path.join(__dirname, "..", "1-assets", "images", imageName);
        response.sendFile(absolutePath);
    }
    catch (err: any) {
        next(err); 
    }
});

// POST http://localhost:3001/api/order -- save order details
router.post("/order", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const order = new OrderModel(request.body);
        const orderSaved = await  productsLogic.saveOrderDetails(order);
        response.status(201).json(orderSaved);
    }
    catch (err: any) {
        next(err);
    }
});

// POST http://localhost:3001/api/contact -- Save user message
router.post("/contact", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const contact = new ContactModel(request.body);
        const addedContact = await  productsLogic.addContact(contact);
        response.status(201).json(addedContact);
    }
    catch (err: any) {
        next(err);
    }
});

export default router;

