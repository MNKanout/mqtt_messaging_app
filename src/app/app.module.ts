import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { MqttModule, IMqttServiceOptions } from 'ngx-mqtt';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { routes } from './routes';
import { MessagingComponent } from './messaging/messaging.component';

const connection: IMqttServiceOptions = {
  hostname: 'b3045d96ad1a4d06abf8b4ceb2245468.s1.eu.hivemq.cloud',
  port: 8884 ,
  path: '/mqtt',
  clean: true, // Retain session
  connectTimeout: 4000, // Timeout period
  reconnectPeriod: 4000, // Reconnect period
  // Authentication information
  // clientId: 'madQTT',
  username: 'admin',
  password: 'Password1234',
  protocol:'wss',
 }


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    MessagingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
    MqttModule.forRoot(connection),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
