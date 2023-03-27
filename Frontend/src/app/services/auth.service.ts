import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { authStore, AuthActionType } from 'src/app/redux/auth-state';
import { CartActionType, cartStore } from 'src/app/redux/cart-state';
import { ProductsActionType, productsStore } from 'src/app/redux/products-state';
import { CityModel } from '../models/city-model';
import { CredentialsModel } from '../models/credentials-model';
import { UserModel } from '../models/user-model';
import { appConfig } from '../utils/app-config';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private user = new BehaviorSubject<CredentialsModel>(null);

    constructor(private http: HttpClient) { }

    // Registering a new user: 
    public async register(user: UserModel): Promise<void> {

        // Send to backend the new user: 
        const observable = this.http.post<string>(appConfig.registerUrl, user);

        // Backend returns token: 
        const token = await firstValueFrom(observable);

        //Save user details in the user variable:
        this.user.next(user);

        // Send token to Redux: 
        authStore.dispatch({ type: AuthActionType.Register, payload: token });
    }

    // Login existing user: 
    public async login(credentials: CredentialsModel): Promise<void> {

        // Send to backend the credentials: 
        const observable = this.http.post<string>(appConfig.loginUrl, credentials);

        // Backend returns token: 
        const token = await firstValueFrom(observable);

        //Save user details in the user variable:
        this.user.next(credentials);

        // Send token to Redux:
        authStore.dispatch({ type: AuthActionType.Login, payload: token });
    }

    // Logout existing user:
    public logout(): void {
        authStore.dispatch({ type: AuthActionType.Logout });
        cartStore.dispatch({ type: CartActionType.FetchProducts, payload: [] })
        productsStore.dispatch({ type: ProductsActionType.FetchProducts, payload: [] })
        this.user.next(null);
    }

    // Get all cities:
    public async getAllCities(): Promise<CityModel[]> {
        const observable = this.http.get<CityModel[]>(appConfig.cityUrl);
        const cities = await firstValueFrom(observable);
        return cities;
    }

    public getUser() {
        return this.user.asObservable();
    }

}
