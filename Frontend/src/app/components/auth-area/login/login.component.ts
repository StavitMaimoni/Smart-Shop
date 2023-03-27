import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CredentialsModel } from 'src/app/models/credentials-model';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

    public credentials = new CredentialsModel();

    public constructor(
        private authService: AuthService, 
        private router: Router,
        private alertService: AlertService
        ) {} 

    public async send() {
        try {
            await this.authService.login(this.credentials);
            this.alertService.success("Welcome Back");
            this.router.navigateByUrl("/shop");
        }
        catch(err: any) {
            this.alertService.error(err);
        }
    }

    public registerNavigate(): void {
        try {
            this.router.navigateByUrl("/register");
        }
        catch (err: any) {
            this.alertService.error(err);
        }
    }
    
}
