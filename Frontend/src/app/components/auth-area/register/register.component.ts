import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/models/user-model';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { CityModel } from 'src/app/models/city-model';
import RoleModel from 'src/app/models/role-model';


@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    public user = new UserModel();
    public confirmPassword: string;
    public step: number = 1;
    public cities: CityModel[] = [];

    public constructor(private authService: AuthService,
        private router: Router,
        private alertService: AlertService,
    ) { }

    public async ngOnInit() {
        try {
            this.cities = await this.authService.getAllCities();
        }
        catch (err: any) {
            this.alertService.error(err);
        }
    }

    public async send() {
        try {
            if (this.confirmPassword !== this.user.password) {
                this.alertService.error("Passwords do not match");
                return;
            }
            this.user.role = RoleModel.User;
            await this.authService.register(this.user);
            this.alertService.success("Welcome " + this.user.firstName);
            this.router.navigateByUrl("/shop");
        }
        catch (err: any) {
            this.alertService.error(err);
        }
    }

    public loginNavigate(): void {
        try {
            this.router.navigateByUrl("/login");
        }
        catch (err: any) {
            this.alertService.error(err);
        }
    }

    public clickButton(buttonName: string): void {
        try {
            if (buttonName === 'Next') {

                if (!this.user.identityCard || !this.user.username || !this.user.password || !this.confirmPassword) {
                    this.alertService.error("Please fill in all input fields in order to continue with the registration");
                    return;
                }
                else {
                    this.step = 2;
                }
            }
            else {
                if (!this.user.firstName || !this.user.lastName || !this.user.cityId || !this.user.street) {
                    this.alertService.error("Please fill in all input fields in order to continue with the registration");
                    return;
                }
                else {
                    this.send();
                }
            }
        }
        catch (err: any) {
            this.alertService.error(err);
        }
    }
}
