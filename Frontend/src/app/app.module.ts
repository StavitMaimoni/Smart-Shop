import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { LayoutComponent } from './components/layout-area/layout/layout.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { HomeComponent } from './components/home-area/home/home.component';
import { PageNotFoundComponent } from './components/layout-area/page-not-found/page-not-found.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductsComponent } from './components/products-area/products/products.component';
import { RegisterComponent } from './components/auth-area/register/register.component';
import { LoginComponent } from './components/auth-area/login/login.component';
import { JwtInterceptor } from './services/jwt.interceptor';
import { HeaderComponent } from './components/layout-area/header/header.component';
import { CartComponent } from './components/products-area/cart/cart.component';
import { CheckoutComponent } from './components/checkout-area/checkout/checkout.component';
import { FinalAccountComponent } from './components/checkout-area/final-account/final-account.component';
import { ShippingDetailsComponent } from './components/checkout-area/shipping-details/shipping-details.component';
import { DashesDirective } from './directives/dashes.directive';
import { AuthMenuComponent } from './components/auth-area/menu/auth-menu.component';
import { ShoppingPageComponent } from './components/products-area/shopping-page/shopping-page.component';
import { AboutComponent } from './components/about-area/about/about.component';
import { ContactComponent } from './components/contact-area/contact/contact.component';
import { FooterComponent } from './components/layout-area/footer/footer.component';
import { EditProductComponent } from './components/products-area/edit-product/edit-product.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
    declarations: [
        LayoutComponent,
        CartComponent,
        HeaderComponent,
        HomeComponent,
        PageNotFoundComponent,
        ProductsComponent,
        RegisterComponent,
        LoginComponent,
        AuthMenuComponent,
        CheckoutComponent,
        FinalAccountComponent,
        ShippingDetailsComponent,
        DashesDirective,
        ShoppingPageComponent,
        AboutComponent,
        ContactComponent,
        FooterComponent,
        EditProductComponent
    ],

    // Which other modules we need: 
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        ReactiveFormsModule

        ],

    // Which components we need to export from our module: 
    exports: [],

    // Which services belongs to our module: 
    providers: [{ useClass: JwtInterceptor, provide: HTTP_INTERCEPTORS, multi: true }],

    // Which component is the first to be loaded in index.html:
    bootstrap: [LayoutComponent]
})
export class AppModule { }
