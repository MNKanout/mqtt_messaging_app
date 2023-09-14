import { Injectable } from '@angular/core';
import {MqttService, IMqttServiceOptions } from 'ngx-mqtt';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {


  constructor(private mqttService: MqttService) {

   }
   connect(){
    this.mqttService.connect()
   }
}
