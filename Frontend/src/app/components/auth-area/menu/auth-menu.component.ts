import { Component, OnDestroy, OnInit } from '@angular/core';
import { Unsubscribe } from 'redux';
import { UserModel } from 'src/app/models/user-model';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { authStore } from 'src/app/redux/auth-state';
import { CartService } from 'src/app/services/cart.service';

@Component({
    selector: 'app-auth-menu',
    templateUrl: './auth-menu.component.html',
    styleUrls: ['./auth-menu.component.css']
})
export class AuthMenuComponent implements OnInit, OnDestroy {
    public alertMessage: string;
    public alertType: string;
    private alertSubscription: Subscription;
    public user: UserModel;
    public token: string;
    private unsubscribe: Unsubscribe;
    public cartClicked: boolean;
    public totalQuantity: number=0;
    public totalPrice: number;

    public constructor(
        private authService: AuthService,
        private alertService: AlertService,
        private cartService: CartService
    ) { }

    public ngOnInit(): void {
        try {
            this.user = authStore.getState().user;
            this.token = authStore.getState().token;
            this.unsubscribe = authStore.subscribe(() => {
                this.user = authStore.getState().user;
                this.token = authStore.getState().token;
            });
            this.alertSubscription = this.alertService.alert$.subscribe(({ type, message }) => {
                this.alertMessage = message;
                this.alertType = type;
                setTimeout(() => {
                    this.alertMessage = null;
                }, 3000);
            });
            this.cartService.getTotalQuantity().subscribe(total => {
                this.totalQuantity = total;
            });
            this.cartService.getTotalPrice().subscribe(total => {
                this.totalPrice = total;
            });
            this.cartService.getCartClicked().subscribe(clicked => {
                this.cartClicked = clicked;
            });
        } catch (err: any) {
            this.alertService.error(err);
        }
    }

    public ngOnDestroy(): void {
        try {
            this.unsubscribe();
            this.alertSubscription.unsubscribe();
        } catch (err: any) {
            this.alertService.error(err);
        }
    }

    public logout(): void {
        try {
            this.alertService.success('Bay bay ' + this.user.firstName);
            this.authService.logout();
        } catch (err: any) {
            this.alertService.error(err);
        }
    }

    public toggleCart(): void {
        try {
            if (this.totalQuantity<1) {
                return;
            }
            this.cartClicked = !this.cartClicked;
            this.cartService.setCartClicked(this.cartClicked);
        } catch (err: any) {
            this.alertService.error(err);
        }
    }

    public scrollTop() {
        document.body.scrollTop = 0;
    }

}
