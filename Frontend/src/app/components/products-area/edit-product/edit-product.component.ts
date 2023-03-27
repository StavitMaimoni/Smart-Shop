import { Component, OnInit, ViewChild } from '@angular/core';
import { CategoryModel } from 'src/app/models/category-model';
import { ProductModel } from 'src/app/models/product-model';
import { AlertService } from 'src/app/services/alert.service';
import { EditService } from 'src/app/services/edit.service';
import { ProductService } from 'src/app/services/product.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-edit-product',
    templateUrl: './edit-product.component.html',
    styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
    @ViewChild('editForm', { static: true }) editForm: NgForm;
    private editClickSubscription: Subscription;
    private productSubscription: Subscription;
    public editClick: boolean;
    public product: ProductModel = new ProductModel();
    public categories: CategoryModel[] = [];
    public url: string | null;

    public constructor(
        private alertService: AlertService,
        private productService: ProductService,
        private editService: EditService,
    ) { }

    public async ngOnInit() {
        this.categories = await this.productService.getAllCategories();
        this.editService.getEditClick().subscribe(clickStatus => {
            this.editClick = clickStatus;
        });
        this.editService.getProduct().subscribe(p => {
            this.product = p;
            this.url = null;
        });
    }

    public async send(clickedButton: string) {
        try {
            if (clickedButton === 'Add') {
                if (!this.product.categoryId || !this.product.name || !this.product.price || !this.product.image) {
                    this.alertService.error("Please fill in all input fields in order to add a product");
                    return;
                }
                else {
                    await this.productService.addProduct(this.product);
                    this.alertService.success("Product has been successfully added");
                    this.editForm.reset();
                    this.url = null;
                }
            } else {
                await this.productService.updateProduct(this.product);
                this.alertService.success("Product has been successfully updated");
                this.editForm.reset();
                this.url = "";
            }
        } catch (err: any) {
            this.alertService.error(err);
        }
    }

    public async onselectFile(event: any) {
        try {
            if (event.target.files) {
                const reader = new FileReader();
                reader.readAsDataURL(event.target.files[0]);
                reader.onload = (e: any) => {
                    this.url = e.target.result
                }
                this.product.image = event.target.files;
                this.product.imageName = event.target.files[0].name;
            }
        } catch (err: any) {
            this.alertService.error(err);
        }
    }

    public toggleEdit(): void {
        try {
            this.product = new ProductModel();
            this.editService.setEditClick(false);
        } catch (err: any) {
            this.alertService.error(err);
        }
    }

    public ngOnDestroy(): void {
        try {
            if (this.editClickSubscription) {
                this.editClickSubscription.unsubscribe();
            }
            if (this.productSubscription) {
                this.productSubscription.unsubscribe();
            }
        } catch (err: any) {
            this.alertService.error(err);
        }
    }
}
