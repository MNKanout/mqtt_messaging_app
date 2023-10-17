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

  constructor(private router: Router) {
  }

  onClick(){
    if (!this.username) {
      this.snackBarComponent.notfiyWarrning("Please enter a username!")
      return;
    }
    this.router.navigate(['/messaging', this.username]);
  }
}
