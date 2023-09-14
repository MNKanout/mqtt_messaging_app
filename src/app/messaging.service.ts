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
    this.mqttService.connect()
   }
   publish(message: string){
    console.log(message)
    const observable = this.mqttService.publish(this.topic, message)
    observable.subscribe(()=>{console.log('Subscribe is called in observable')})
   }
}
