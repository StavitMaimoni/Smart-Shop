import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AlertService {

    private alertSubject = new Subject<{ type: string, message: string }>();

    alert$ = this.alertSubject.asObservable();

    success(message: string) {
        this.alertSubject.next({ type: 'success', message });
    }
    error(error: any) {
        let message = '';

        if (typeof error === 'object' && error !== null) {
            message = this.extractErrorMessage(error);
        } else {
            message = error;
        }

        this.alertSubject.next({ type: 'error', message });
    }

    private extractErrorMessage(err: any): string {
        console.log('error object:', err);
      
        // Front: throw "some error...";
        if (typeof err === "string") return err;
      
        // Back: throws string (500 - server crash / 401 - unauthorized / 404...)
        if (typeof err.response?.data === "string") return err.response.data;
      
        // Back throws string[] (400 - validation)
        if (Array.isArray(err.response?.data)) return err.response.data[0];
      
        // Check if error object has an error property
        if (typeof err.error === 'string') return err.error;
      
        // Front: throw new Error("some error...");
        if (typeof err.message === "string") return err.message;
      
        // Other: 
        return "Some error occurred, please try again";
      }
      


}


