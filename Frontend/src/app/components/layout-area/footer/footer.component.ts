import { Component, OnInit } from '@angular/core';
import { CredentialsModel } from 'src/app/models/credentials-model';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
    public userEmail: string = "";
    public user: CredentialsModel;
    private userSubscription: Subscription;

    public constructor(
        private alertService: AlertService,
        private authService: AuthService,
    ) { }

    public async ngOnInit() {
        this.userSubscription = this.authService.getUser().subscribe(credential => {
            this.user = credential;
        });
    }

    public subscribe() {
        try {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(this.userEmail)) {
                this.alertService.error("Invalid email address");
                return;
            }
            else {
                this.alertService.success("Thank you for subscribing!");
            }
        } catch (err: any) {
            this.alertService.error(err);
        }
    }

    public scrollTop() {
        document.body.scrollTop = 0;
    }

    public ngOnDestroy(): void {
        try {
            if (this.userSubscription) {
                this.userSubscription.unsubscribe();
            }
        } catch (err: any) {
            this.alertService.error(err);
        }
    }
}


