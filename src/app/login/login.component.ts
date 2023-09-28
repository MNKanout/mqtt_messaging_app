import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  username: string | undefined;

  constructor(private router: Router) {
  }

  onClick(){
    if (this.username) {
    this.router.navigate(['/messaging', this.username]);
  } else {
    this.router.navigate(['404']);
  }
  }
}
