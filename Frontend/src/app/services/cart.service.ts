import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private cartClicked = new BehaviorSubject<boolean>(false);
    private popUpCard = new BehaviorSubject<boolean>(false);
    private totalQuantity = new BehaviorSubject<number>(0);
    private totalPrice = new BehaviorSubject<number>(0);

    public setPopUpCard(clickStatus: boolean) {
        this.popUpCard.next(clickStatus);
    }

    public getPopUpCard() {
        return this.popUpCard.asObservable();
    }

    public setCartClicked(clickStatus: boolean) {
        this.cartClicked.next(clickStatus);
    }

    public getCartClicked() {
        return this.cartClicked.asObservable();
    }

    public setTotalPrice(price: number) {
        this.totalPrice.next(price);
    }

    public getTotalPrice() {
        return this.totalPrice.asObservable();

    }

    public setTotalQuantity(quantity: number) {
        this.totalQuantity.next(quantity);
    }

    public getTotalQuantity() {
        return this.totalQuantity.asObservable();
    }
}
