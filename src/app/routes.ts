import { Route } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MessagingComponent } from './messaging/messaging.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const usernameRoutingVariable = 'username';

export const routes: Route[] = [
    {path:'', component: HomeComponent},
    {path:'login', component: LoginComponent},
    {path:'messaging/:'+ usernameRoutingVariable, component: MessagingComponent},
    {path:'not-found', component:NotFoundComponent},
    // Wildcard for undefined urls.
    {path:'**', redirectTo: 'not-found', pathMatch:'full'},
  ];
