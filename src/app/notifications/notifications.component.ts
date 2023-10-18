import { Direction } from '@angular/cdk/bidi';
import { Component } from '@angular/core';
import { 
  MatSnackBar, 
  MatSnackBarVerticalPosition, 
  MatSnackBarHorizontalPosition,
 } 
 from '@angular/material/snack-bar';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})

export class NotificationsComponent {
  // snackBar config
  verticalPosition: MatSnackBarVerticalPosition =  'top';
  horizontalPosition: MatSnackBarHorizontalPosition =  'center';
  direction: Direction = 'ltr';
  duration = 3000;

  constructor(private _snackBar: MatSnackBar){}

  notifySuccess(message: string){
    this._snackBar.open(message, undefined, 
    {
      panelClass: 'snack-bar-success',
      verticalPosition: this.verticalPosition,
      horizontalPosition: this.horizontalPosition,
      direction: this.direction,
      duration: this.duration,
    }
  )};

  notifyWarning(message: string){
    this._snackBar.open(message, undefined, 
    {
      panelClass: 'snack-bar-warning',
      verticalPosition: this.verticalPosition,
      horizontalPosition: this.horizontalPosition,
      direction: this.direction,
      duration: this.duration,
    }
  )};

  notifyDanger(message: string){
    this._snackBar.open(message, undefined, 
    {
      panelClass: 'snack-bar-danger',
      verticalPosition: this.verticalPosition,
      horizontalPosition: this.horizontalPosition,
      direction: this.direction,
      duration: this.duration,
    }
  )};
}
