import { Route } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MessagingComponent } from './messaging/messaging.component';


const routes: Route[] = [
    {path:'', component: HomeComponent},
    {path:'login', component: LoginComponent},
    {path:'messaging', component: MessagingComponent},
  ]
  
export {routes};