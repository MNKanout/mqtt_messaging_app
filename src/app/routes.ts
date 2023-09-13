import { Route } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';


const routes: Route[] = [
    {path:'', component:HomeComponent},
    {path:'login', component:LoginComponent}
  ]
  
export {routes};