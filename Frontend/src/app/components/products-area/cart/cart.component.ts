import { Component, OnInit } from '@angular/core';
import { ProductModel } from 'src/app/models/product-model';
import { appConfig } from 'src/app/utils/app-config';
import { CartActionType, cartStore } from 'src/app/redux/cart-state';
import { productsStore, ProductsActionType } from 'src/app/redux/products-state';
import { ProductService } from 'src/app/services/product.service';
import { AlertService } from 'src/app/services/alert.service';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import RoleModel from 'src/app/models/role-model';
import { authStore } from 'src/app/redux/auth-state';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css']
})

export class CartComponent implements OnInit {
    private cartStoreSubscription: Subscription;
    private cartServiceSubscription: Subscription;
    public products: ProductModel[] = [];
    public imgRoute = appConfig.productImagesUrl;
    public totalPrice: number = 0;
    public cartClicked: boolean;
    public userRole: RoleModel;

    public constructor(
        private productService: ProductService,
        private alertService: AlertService,
        private router: Router,
        private cartService: CartService
    ) { }

    ngOnInit() {
        try {
            this.userRole = authStore.getState().user.role;
            cartStore.subscribe(() => {
                this.products = cartStore.getState().products;
                this.totalPrice = 0;
                for (let i = 0; i < this.products.length; i++) {
                    this.totalPrice += this.products[i].price * this.products[i].quantity;
                }
                this.cartService.setTotalPrice(this.totalPrice);
                let sum = 0;
                for (let i = 0; i < this.products.length; i++) {
                    const product = this.products[i];
                    sum += product.quantity;
                }

                this.cartService.setTotalQuantity(sum);
            });
            this.cartService.getCartClicked().subscribe(clickStatus => {
                this.cartClicked = clickStatus;
            });
        }
        catch (err: any) {
            this.alertService.error(err);
        }
    }

    public async deleteProduct(id: string) {
        try {
            this.cartService.setPopUpCard(false);
            cartStore.dispatch({ type: CartActionType.DeleteProduct, payload: id });
            this.productService.deleteItem(id);
            const productToUpdate = productsStore.getState().products.find(p => p._id === id);
            productToUpdate.quantity = 0;
            productsStore.dispatch({ type: ProductsActionType.UpdateProduct, payload: productToUpdate });
            await this.productService.updateProduct(productToUpdate);
        }
        catch (err: any) {
            this.alertService.error(err);
        }
    }

    public async emptyCart() {
        try {
            if (!(window.confirm("Are you sure you want to empty your cart?"))) return;
            this.productService.emptyCart();
        } catch (err: any) {
            this.alertService.error(err);
        }
    }

    public checkout(): void {
        try {
            this.router.navigateByUrl("/checkout");
        }
        catch (err: any) {
            this.alertService.error(err);
        }
    }

    public toggleCart(): void {
        this.cartClicked = !this.cartClicked;
        this.cartService.setCartClicked(this.cartClicked);
    }

    public ngOnDestroy(): void {
        try {
            if (this.cartStoreSubscription) {
                this.cartStoreSubscription.unsubscribe();
            }
            if (this.cartServiceSubscription) {
                this.cartServiceSubscription.unsubscribe();
            }
        } catch (err: any) {
            this.alertService.error(err);
        }
    }
}
