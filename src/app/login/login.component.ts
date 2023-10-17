import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  @ViewChild(SnackBarComponent) snackBarComponent!: SnackBarComponent;

  username: string = '';
  specialChar: RegExp = /[^A-Za-z0-9]/;

  constructor(private router: Router) {
  }

  onClick(){
    if (!this.username) {
      this.snackBarComponent.notfiyWarrning("Please enter a username!")
      return;
    }
    if (this.specialChar.test(this.username)){
      this.snackBarComponent.notfiyDanger("Invalid Username")
      return;
    }
    this.router.navigate(['/messaging', this.username]);
  }
}
