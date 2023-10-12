import { Direction } from '@angular/cdk/bidi';
import { Component } from '@angular/core';
import { 
  MatSnackBar, 
  MatSnackBarVerticalPosition, 
  MatSnackBarHorizontalPosition,
 } 
 from '@angular/material/snack-bar';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.css']
})

export class SnackBarComponent {
  // snackBar config
  verticalPosition: MatSnackBarVerticalPosition =  'top';
  horizontalPosition: MatSnackBarHorizontalPosition =  'center';
  direction: Direction = 'ltr';
  duration = 3000;

  constructor(private _snackBar: MatSnackBar){}

  notfiySuccess(message: string){
    this._snackBar.open(message, undefined, 
    {
      panelClass: 'snack-bar-success',
      verticalPosition: this.verticalPosition,
      horizontalPosition: this.horizontalPosition,
      direction: this.direction,
      duration: this.duration,
    }
  )};

  notfiyWarrning(message: string){
    this._snackBar.open(message, undefined, 
    {
      panelClass: 'snack-bar-warning',
      verticalPosition: this.verticalPosition,
      horizontalPosition: this.horizontalPosition,
      direction: this.direction,
      duration: this.duration,
    }
  )};

  notfiyDanger(message: string){
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
