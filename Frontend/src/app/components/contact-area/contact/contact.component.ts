import { Component, ViewChild } from '@angular/core';
import { ContactModel } from 'src/app/models/contact-model';
import { AlertService } from 'src/app/services/alert.service';
import { ProductService } from 'src/app/services/product.service';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { from } from 'rxjs';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.css']
})
export class ContactComponent {
    @ViewChild('contactForm', { static: true }) contactForm: NgForm;

    public contact = new ContactModel();

    public constructor(
        private alertService: AlertService,
        private productService: ProductService
    ) { }

    public send() {
        try {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!this.contact.name || !this.contact.email || !this.contact.phone || !this.contact.subject || !this.contact.message) {
                this.alertService.error("Please fill in all input fields in order to send a message");
                return;
            }
            if (!emailRegex.test(this.contact.email)) {
                this.alertService.error("Invalid email address");
                return;
            }
            else {
                from(this.productService.saveUserMessage(this.contact))
                    .subscribe(
                        () => {
                            this.alertService.success("Thank you for your message!");
                            this.contactForm.reset();
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
}
