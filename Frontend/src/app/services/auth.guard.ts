import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthState, authStore } from 'src/app/redux/auth-state';
import { AlertService } from './alert.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    public constructor(
        private router: Router,
        private alertService: AlertService,
    ){}

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const authState: AuthState = authStore.getState();

        if (authState.token) {
            return true;
        } else {
            //  authState.user !== null;
            this.router.navigateByUrl("/login");
            return false;
        }
    }
}
