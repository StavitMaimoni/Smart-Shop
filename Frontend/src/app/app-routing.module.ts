import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './components/about-area/about/about.component';
import { LoginComponent } from './components/auth-area/login/login.component';
import { RegisterComponent } from './components/auth-area/register/register.component';
import { CheckoutComponent } from './components/checkout-area/checkout/checkout.component';
import { ContactComponent } from './components/contact-area/contact/contact.component';
import { HomeComponent } from './components/home-area/home/home.component';
import { PageNotFoundComponent } from './components/layout-area/page-not-found/page-not-found.component';
import { ShoppingPageComponent } from './components/products-area/shopping-page/shopping-page.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
    { path: "register", component: RegisterComponent },
    { path: "login", component: LoginComponent },
    { path: "home", component: HomeComponent },
    { path: "shop", component: ShoppingPageComponent , canActivate: [AuthGuard]},
    { path: "checkout", component: CheckoutComponent },
    { path: "about", component: AboutComponent },
    { path: "contact", component: ContactComponent },
    { path: "", redirectTo: "/home", pathMatch: "full" }, 
    { path: "**", component: PageNotFoundComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
