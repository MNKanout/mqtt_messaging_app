import { Injectable } from '@angular/core';
import {MqttService } from 'ngx-mqtt';
import { Message } from './message.interface';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  constructor(private mqttService: MqttService) {

   }

   connect(){
    this.mqttService.connect();
   }

   disconnect(){
    this.mqttService.disconnect();
   }

   publish(message: Message){
    const observable$ = this.mqttService.publish(message.topic, message.text);
    return observable$
   }

   subscribe(topic: string){
    const observable$ = this.mqttService.observe(topic);
    return observable$;
   }
}
