import { Injectable } from '@angular/core';
import {MqttService } from 'ngx-mqtt';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  topic: string = 'channel_1';

  constructor(private mqttService: MqttService) {

   }

   connect(){
    this.mqttService.connect();
   }

   publish(message: string){
    const observable = this.mqttService.publish(this.topic, message);
    observable.subscribe(()=>{console.log('Publisher sent:', message)});
    // Unsubscribe needed to prevent memory leak.
   }

   subscribe(){
    const observable$ = this.mqttService.observe(this.topic);
    return observable$;
   }

   disconnect(){
    this.mqttService.disconnect()
   }
}
