import { Injectable } from '@angular/core';
import { OrderModel } from '../models/order-model';
import { ProductModel } from '../models/product-model';
import { UserModel } from '../models/user-model';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


@Injectable({
    providedIn: 'root'
})
export class InvoiceService {

    private user = new UserModel();
    private currentDate = this.getCurrentDate();
    private total = 0;;

    public getCurrentDate() {
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
        return year + "-" + month + "-" + toDate;
    }

    generateInvoice(order: OrderModel, products: ProductModel[]) {
        this.user.identityCard = 123456789;
        this.user.firstName = 'Britney';
        this.user.lastName = 'Spears';
        this.user.cityId = 'Pop';
        this.user.street = 'Queen';
        this.user.username = 'spears@gmail.com';
        const invoiceNumber=Math.floor(100000 + Math.random() * 900000);

        for (const product of products) {
            const amount = product.price * product.quantity;
            this.total += amount;
        }
        const doc = new jsPDF();

        autoTable(doc, {
            body: [
                [
                    {
                        content: 'Shopping Fun',
                        styles: {
                            halign: 'left',
                            fontSize: 20,
                            textColor: '#ffffff'
                        }
                    },
                    {
                        content: 'Invoice',
                        styles: {
                            halign: 'right',
                            fontSize: 20,
                            textColor: '#ffffff'
                        }
                    }
                ],
            ],
            theme: 'plain',
            styles: {
                fillColor: '#3366ff'
            }
        });

        autoTable(doc, {
            body: [
                [
                    {
                        content: 'Reference: #INV0001'
                            + '\nOrder date:' + this.currentDate
                            + '\nShipping date:' + order.shipDate
                            + '\nInvoice number:'+ invoiceNumber,
                        styles: {
                            halign: 'right'
                        }
                    }
                ],
            ],
            theme: 'plain'
        });

        autoTable(doc, {
            body: [
                [
                    {
                        content: 'Billed to:'
                            + '\n' + this.user.firstName +" "+ this.user.lastName
                            + '\n' + this.user.cityId
                            + '\n' + this.user.street
                            + '\nIsrael',
                        styles: {
                            halign: 'right'
                        }
                    },
                    {
                        content: 'Shipping address:'
                            + '\n' + order.shipCity
                            + '\n' + order.shipStreet
                            + '\nIsrael',
                        styles: {
                            halign: 'right'
                        }
                    }
                ],
            ],
            theme: 'plain'
        });

        autoTable(doc, {
            body: [
                [
                    {
                        content: 'Amount due:',
                        styles: {
                            halign: 'right',
                            fontSize: 14
                        }
                    }
                ],
                [
                    {
                        content: '$' + this.total.toFixed(2),
                        styles: {
                            halign: 'right',
                            fontSize: 20,
                            textColor: '#3366ff'
                        }
                    }
                ],
                [
                    {
                        content: 'Due date:' + order.shipDate,
                        styles: {
                            halign: 'right'
                        }
                    }
                ]
            ],
            theme: 'plain'
        });

        autoTable(doc, {
            body: [
                [
                    {
                        content: 'Total products',
                        styles: {
                            halign: 'left',
                            fontSize: 14
                        }
                    }
                ]
            ],
            theme: 'plain'
        });
        autoTable(doc, {
            head: [['Items', 'Quantity', 'Price', 'Total price']],
            body: products.map((product) => [
                product.name,
                product.quantity,
                product.price.toFixed(2),
                product.price * product.quantity
              ]),            theme: 'striped',
            headStyles: {
                fillColor: '#343a40'
            }
        });
        autoTable(doc, {
            body: [
                [
                    {
                        content: 'Total price:',
                        styles: {
                            halign: 'right'
                        }
                    },
                    {
                        content: this.total.toFixed(2) +'$',
                        styles: {
                            halign: 'right'
                        }
                    },
                ],
            ],
            theme: 'plain'
        });

        autoTable(doc, {
            body: [
                [
                    {
                        content: 'Enjoy our products, we look forward to seeing you again ;)',
                        styles: {
                            halign: 'left'
                        }
                    }
                ]
            ],
            theme: "plain"
        });

        doc.setFontSize(10);
        doc.save("Invoice.pdf");
    }
}

