import { Injectable } from '@angular/core';
import {MqttService, MqttConnectionState } from 'ngx-mqtt';
import { Message } from './message.interface';
import { map, distinctUntilChanged } from 'rxjs';

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

   getConnectedStatus() {
    const statusObservable$ = this.mqttService.state
      .pipe(
        map(state => {
          return state === MqttConnectionState.CONNECTED
        }),
        distinctUntilChanged(),
      );
    return statusObservable$;
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
