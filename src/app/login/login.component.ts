import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationsComponent } from '../notifications/notifications.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  @ViewChild(NotificationsComponent) snackBarComponent!: NotificationsComponent;

  username: string = '';
  specialChar: RegExp = /[^A-Za-z0-9]/;

  constructor(private router: Router) {
  }

  onClick(){
    if (!this.username) {
      this.snackBarComponent.notifyWarning("Please enter a username!")
      return;
    }
    if (this.specialChar.test(this.username)){
      this.snackBarComponent.notifyDanger("Invalid Username")
      return;
    }
    this.router.navigate(['/messaging', this.username]);
  }
}
