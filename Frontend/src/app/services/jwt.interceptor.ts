import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { authStore } from 'src/app/redux/auth-state';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        
        if(authStore.getState().token) {
            request = request.clone({
                setHeaders: {
                    authorization: "Bearer " + authStore.getState().token
                }
            });
        }

        return next.handle(request);
    }
}
