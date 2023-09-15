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

   publish(message: Message){
    const observable = this.mqttService.publish(message.topic, message.text);
    observable.subscribe(()=>{console.log('Publisher sent:', message)});
    // Unsubscribe needed to prevent memory leak.
   }

   subscribe(topic: string){
    const observable$ = this.mqttService.observe(topic);
    return observable$;
   }

   disconnect(){
    this.mqttService.disconnect();
   }
}
