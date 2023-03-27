import { Component } from '@angular/core';
import RoleModel from 'src/app/models/role-model';
import { authStore } from 'src/app/redux/auth-state';

@Component({
  selector: 'app-shopping-page',
  templateUrl: './shopping-page.component.html',
  styleUrls: ['./shopping-page.component.css']
})
export class ShoppingPageComponent {
    public userRole: RoleModel;

    public async ngOnInit() {
        this.userRole = authStore.getState().user.role;
    }

}
