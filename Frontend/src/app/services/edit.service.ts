import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductModel } from '../models/product-model';

@Injectable({
  providedIn: 'root'
})
export class EditService {
  private editClick = new BehaviorSubject<boolean>(false);
  private product= new BehaviorSubject<ProductModel>(new ProductModel());

  public setEditClick(clickStatus: boolean) {
    this.editClick.next(clickStatus);
  }

  public getEditClick() {
    return this.editClick.asObservable();
  }

  public setProduct(p:ProductModel) {
    this.product.next(p);
  }

  public getProduct() {
    return this.product.asObservable();
  }

}
