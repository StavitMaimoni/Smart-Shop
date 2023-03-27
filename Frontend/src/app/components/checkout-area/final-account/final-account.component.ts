import { Component, OnInit } from '@angular/core';
import { ProductModel } from 'src/app/models/product-model';
import { AlertService } from 'src/app/services/alert.service';
import { appConfig } from 'src/app/utils/app-config';
import { ProductService } from 'src/app/services/product.service';
import { cartStore, CartActionType } from 'src/app/redux/cart-state';

@Component({
    selector: 'app-final-account',
    templateUrl: './final-account.component.html',
    styleUrls: ['./final-account.component.css']
})

export class FinalAccountComponent implements OnInit {
    public allProducts: ProductModel[] = [];
    public userCart: ProductModel[] = [];
    public imgRoute = appConfig.productImagesUrl;
    public total: number;
    public searchClick = false;
    public today:string;
    private originalCart: any[];

    public constructor(
        private alertService: AlertService,
        private productService: ProductService,
    ) { }

    ngOnInit() {
        this.getProductsCart();
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = today.getFullYear();
        this.today = mm + '/' + dd + '/' + yyyy;    
    }

    private async getProductsCart() {
        try {
            this.allProducts = await this.productService.getAllProducts();
            const itemArr = await this.productService.getItemByUser(); // get the items from the user's cart            
            // Filter the allProducts array based on the userCart and store the matching products in the userCart array
            this.allProducts.filter((product) => {
                const userProduct = itemArr.find((item) => item.productId === product._id);
                if (userProduct) {
                    // If the product exists in the userCart, add it to the userCart array
                    this.userCart.push({
                        ...product,
                        quantity: userProduct.quantity // add the quantity from the userCart to the userCart item
                    });
                }
            });
            // Dispatch an action to update the cart with the products from the userCart array
            cartStore.dispatch({ type: CartActionType.FetchProducts, payload: this.userCart });
            this.total = 0;
            for (let i = 0; i < this.userCart.length; i++) {
                this.total += this.userCart[i].price * this.userCart[i].quantity;
            }
        }
        catch (err: any) {
            this.alertService.error(err);
        }
    }

    public async search(searchText: string) {
        try {
            this.searchClick = true;
            if (!this.originalCart) {
                this.originalCart = this.userCart.slice(0);
            }
            let input = searchText.toLowerCase();
            if (!input) { // check if search text is empty or null
                this.userCart = this.originalCart.slice(0);
                this.searchClick = false;
                return;
            }
            this.userCart = this.originalCart.filter(function (p) {
                p.highlightedName = p.name;
                if (p.name.toLowerCase().indexOf(input) > -1 || p.name.toUpperCase().indexOf(input) > -1) {
                    const startIndex = p.name.toLowerCase().indexOf(input);
                    const endIndex = startIndex + input.length;
                    p.highlightedName = p.name.slice(0, startIndex) +
                        "<mark>" + p.name.slice(startIndex, endIndex) + "</mark>" +
                        p.name.slice(endIndex);
                }
                return p.name.toLowerCase().indexOf(input) > -1 || p.name.toUpperCase().indexOf(input) > -1
                    || p.price.toString().indexOf(input) > -1;
            });
            if (this.userCart.length === 0) {
                this.searchClick = false;
            }
        } catch (err: any) {
            this.alertService.error(err);
        }
    }
}
