import { Component, ViewChild } from '@angular/core';
import { OrderModel } from 'src/app/models/order-model';
import { AlertService } from 'src/app/services/alert.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { ProductModel } from 'src/app/models/product-model';
import { ProductService } from 'src/app/services/product.service';
import { cartStore, CartActionType } from 'src/app/redux/cart-state';
import { UserModel } from 'src/app/models/user-model';
import { authStore } from 'src/app/redux/auth-state';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { from } from 'rxjs';


@Component({
    selector: 'app-shipping-details',
    templateUrl: './shipping-details.component.html',
    styleUrls: ['./shipping-details.component.css']
})
export class ShippingDetailsComponent {
    @ViewChild('orderForm', { static: true }) orderForm: NgForm;

    public order = new OrderModel();
    public minDate: string;
    public cityName: string;
    public popUpCard = false;
    public cartProducts: ProductModel[] = [];
    public allProducts: ProductModel[] = [];
    public user: UserModel;
    public totalPrice: number;
    private totalPriceSubscription: Subscription;

    public constructor(
        private alertService: AlertService,
        private invoiceService: InvoiceService,
        private productService: ProductService,
        private authService: AuthService,
        private cartService: CartService
    ) { }

    public async ngOnInit() {
        this.getMinDate();
        this.getProductsCart();
        this.user = authStore.getState().user;
        const cities = await this.authService.getAllCities();
        const city = cities.find(c => c._id === this.user.cityId);
        this.cityName = city.name;
        this.totalPriceSubscription = this.cartService.getTotalPrice().subscribe(total => {
            this.totalPrice = total;
        });
    }

    private async getProductsCart() {
        try {
            this.allProducts = await this.productService.getAllProducts();
            for (let i = 0; i < this.allProducts.length; i++) {
                if (this.allProducts[i].quantity > 0) {
                    this.cartProducts.push(this.allProducts[i])
                }
            }
        }
        catch (err: any) {
            this.alertService.error(err);
        }
    }

    public getMinDate() {
        let date: any = new Date();
        let toDate: any = date.getDate();
        if (toDate < 10) {
            toDate = "0" + toDate;
        }
        let month: any = date.getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        }
        let year: any = date.getFullYear();
        this.minDate = year + "-" + month + "-" + toDate;
    }

    public async send() {
        try {
            if (!this.order.shipCity || !this.order.shipStreet || !this.order.shipDate || !this.order.creditCard) {
                this.alertService.error("Please fill in all input fields in order to continue the payment process");
                return;
            }
            else {
                this.order.creditCard = this.order.creditCard.replace(/-/g, "");
                this.order.finalPrice = this.totalPrice;
                from(this.productService.saveOrderDetails(this.order)
                )
                    .subscribe(
                        () => {
                            this.popUpCard = true;
                            this.orderForm.reset();
                        },
                        (error: HttpErrorResponse) => {
                            this.alertService.error(error);
                        }
                    );
            }
        } catch (err: any) {
            this.alertService.error(err);
        }
    }

    public submitOrder(clickedButton: string): void {
        try {
            if (clickedButton === 'download') {
                this.invoiceService.generateInvoice(this.order, this.cartProducts);
            }
            this.productService.emptyCart();
            this.productService.closeCart();
            this.alertService.success("Payment was successfully completed");

            let emptyCart: ProductModel[] = [];
            cartStore.dispatch({ type: CartActionType.FetchProducts, payload: emptyCart });

        } catch (err) {
            this.alertService.error(err);
        }
    }

    public ngOnDestroy(): void {
        try {
            if (this.totalPriceSubscription) {
                this.totalPriceSubscription.unsubscribe();
            }
        } catch (err: any) {
            this.alertService.error(err);
        }
    }
}


