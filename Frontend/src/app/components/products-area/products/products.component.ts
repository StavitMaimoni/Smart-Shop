import { Component, OnInit } from '@angular/core';
import { CategoryModel } from 'src/app/models/category-model';
import { ProductModel } from 'src/app/models/product-model';
import { ProductService } from 'src/app/services/product.service';
import { appConfig } from 'src/app/utils/app-config';
import { CartActionType, cartStore } from 'src/app/redux/cart-state';
import { productsStore, ProductsActionType } from 'src/app/redux/products-state';
import { AlertService } from 'src/app/services/alert.service';
import { CartService } from 'src/app/services/cart.service';
import { authStore } from 'src/app/redux/auth-state';
import RoleModel from 'src/app/models/role-model';
import { EditService } from 'src/app/services/edit.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css']
})

export class ProductsComponent implements OnInit {
    public categories: CategoryModel[] = [];
    public productsByCategory: ProductModel[] = [];
    public allProducts: ProductModel[] = [];
    public filterProducts: ProductModel[] = [];
    public userCart: ProductModel[] = [];
    public imgRoute = appConfig.productImagesUrl;
    public NoResult = false;
    public categoryClicked = false;
    public popUpCard: boolean;
    public cartClicked: boolean;
    public cartActive: boolean;
    public selectedProduct: ProductModel;
    public activeCategoryId: string | null = null;
    public userRole: RoleModel;
    public editClick: boolean;
    private cartSubscription: Subscription;

    public constructor(
        private productService: ProductService,
        private alertService: AlertService,
        private cartService: CartService,
        private editService: EditService,
    ) { }

    public async ngOnInit() {
        this.getProductsData();
        this.userRole = authStore.getState().user.role;
        this.cartSubscription =this.cartService.getPopUpCard().subscribe(clickStatus => {
            this.popUpCard = clickStatus;
        });
    }

    private async getProductsData() {
        try {
            this.categories = await this.productService.getAllCategories();
            this.allProducts = await this.productService.getAllProducts();
            this.filterProducts = [...this.allProducts];
            const itemCart = await this.productService.getItemByUser();

            // Update the userCart with products that match items in the itemCart
            this.userCart = this.allProducts
                .filter(product => itemCart.some(item => item.productId === product._id))
                .map(product => ({
                    ...product,
                    quantity: itemCart.find(item => item.productId === product._id).quantity
                }));

            // Update the filterProducts array with quantities from the userCart
            this.filterProducts.forEach(product => {
                const matchingItem = this.userCart.find(item => item._id === product._id);
                product.quantity = matchingItem ? matchingItem.quantity : 0;
            });

            // Dispatch actions to update the cart and products state
            cartStore.dispatch({ type: CartActionType.FetchProducts, payload: this.userCart });
            productsStore.dispatch({ type: ProductsActionType.FetchProducts, payload: this.filterProducts });
        } catch (err) {
            this.alertService.error(err);
        }
    }

    public async displayAllProducts() {
        try {
            this.activeCategoryId = null;
            this.cartActive = !this.cartActive;
            this.filterProducts = await this.productService.getAllProducts();
            productsStore.dispatch({ type: ProductsActionType.FetchProducts, payload: this.filterProducts });
        }
        catch (err: any) {
            this.alertService.error(err);
        }
    }

    public async displayProductsByCategory(categoryId: string) {
        try {
            this.activeCategoryId = categoryId;
            this.cartActive = !this.cartActive;
            this.filterProducts = await this.productService.getProductsByCategory(categoryId);
            productsStore.dispatch({ type: ProductsActionType.FetchProducts, payload: this.filterProducts });
        }
        catch (err: any) {
            this.alertService.error(err);
        }
    }

    public async search(searchText: string) {
        try {
            this.filterProducts = this.allProducts.slice(0, this.allProducts.length);
            let input = searchText.toLowerCase();
            this.filterProducts = this.allProducts.filter(function (p) {
                return p.name.toLowerCase().indexOf(input) > -1 || p.name.toUpperCase().indexOf(input) > -1
                    || p.price.toString().indexOf(input) > -1;
            });
            if (this.filterProducts.length === 0) this.NoResult = true;
            else this.NoResult = false;
        }
        catch (err: any) {
            this.alertService.error(err);
        }
    }

    public async incrementItem(product: ProductModel) {
        try {
            if (cartStore.getState().products.length === 0) {
                await this.productService.addCart();
            }
            const index = this.filterProducts.findIndex(p => p._id === product._id);
            this.filterProducts[index].quantity++;
            this.selectedProduct.quantity = this.filterProducts[index].quantity;
            this.productService.updateProduct(this.filterProducts[index]);
            await this.productService.addItem(this.filterProducts[index]);
            productsStore.dispatch({ type: ProductsActionType.UpdateProduct, payload: this.filterProducts[index] });
            this.alertService.success(`${product.name} added to cart`);
        }
        catch (err: any) {
            this.alertService.error(err);
        }
    }

    public addToCart(product: ProductModel) {
        try {
            this.selectedProduct = product;
            this.popUpCard = !this.popUpCard;
        }
        catch (err: any) {
            this.alertService.error(err);
        }
    }

    public decrementItem(product: ProductModel) {
        try {
            if (product.quantity < 1) {
                return;
            }
            const index = this.filterProducts.findIndex(p => p._id === product._id);
            if (product.quantity > 0) {
                this.filterProducts[index].quantity--;
                this.productService.updateProduct(this.filterProducts[index]);
            }
            if (productsStore.getState().products[index].quantity === 0) {
                this.productService.deleteItem(this.filterProducts[index]._id);
                cartStore.dispatch({ type: CartActionType.DeleteProduct, payload: productsStore.getState().products[index]._id });
                productsStore.dispatch({ type: ProductsActionType.UpdateProduct, payload: productsStore.getState().products[index] });
            } else {
                const findInStore = cartStore.getState().products.findIndex(p => p._id === product._id);
                if (findInStore >= 0) {
                    this.productService.addItem(this.filterProducts[index]);
                    cartStore.dispatch({ type: CartActionType.UpdateProduct, payload: this.filterProducts[index] });
                }
            }
            this.selectedProduct.quantity = this.filterProducts[index].quantity;
        }
        catch (err: any) {
            this.alertService.error(err);
        }
    }

    public toggleCart(quantity: number): void {
        try {
            if (quantity < 1) {
                this.selectedProduct.quantity = 0;
            }
            this.cartService.setCartClicked(true);
        } catch (err: any) {
            this.alertService.error(err);
        }
    }

    public toggleEdit(): void {
        try {
            this.editService.setEditClick(true);
        } catch (err: any) {
            this.alertService.error(err);
        }
    }

    public leftScroll() {
        try {
            const container = document.querySelector('.categoryContainer');
            container.scrollBy({
                left: -200,
                behavior: 'smooth',
            });
        } catch (err: any) {
            this.alertService.error(err);
        }
    }

    public rightScroll() {
        try {
            const container = document.querySelector('.categoryContainer');
            container.scrollBy({
                left: 200,
                behavior: 'smooth',
            });
        } catch (err: any) {
            this.alertService.error(err);
        }
    }

    public editProduct(product: ProductModel) {
        try {
            this.editService.setProduct(product);
        } catch (err: any) {
            this.alertService.error(err);
        }
    }

    public ngOnDestroy(): void {
        try {
            this.cartSubscription.unsubscribe();
        } catch (err: any) {
            this.alertService.error(err);
        }
    }

}
