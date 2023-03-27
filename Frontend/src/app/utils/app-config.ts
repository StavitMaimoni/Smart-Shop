class AppConfig {
    public categoriesUrl = "http://localhost:3001/api/categories/";
    public productsByCategoryUrl = "http://localhost:3001/api/products-by-category/";
    public cartByUserUrl = "http://localhost:3001/api/cart-by-user/";
    public itemByUserUrl = "http://localhost:3001/api/item-by-user/";
    public productsUrl = "http://localhost:3001/api/products/";
    public cartsUrl = "http://localhost:3001/api/cart/";
    public itemUrl = "http://localhost:3001/api/item/";
    public orderUrl = "http://localhost:3001/api/order/";
    public productImagesUrl = "http://localhost:3001/api/product/images/";
    public registerUrl = "http://localhost:3001/api/auth/register/";
    public loginUrl = "http://localhost:3001/api/auth/login/";
    public cityUrl = "http://localhost:3001/api/cities/";
    public contactUrl= "http://localhost:3001/api/contact";
}

export const appConfig= new AppConfig();