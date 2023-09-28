import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { MqttModule} from 'ngx-mqtt';
import { FormsModule } from '@angular/forms';

// Local
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { routes } from './routes';
import { MessagingComponent } from './messaging/messaging.component';
import { connection } from './mqtt.config';
import { NotFoundComponent } from './not-found/not-found.component';

// Styling
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatCardModule} from '@angular/material/card';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    MessagingComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
    MqttModule.forRoot(connection),
    FormsModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatButtonModule,
    FlexLayoutModule,
    MatCardModule,
    

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
