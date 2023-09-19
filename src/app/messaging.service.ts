import { Injectable } from '@angular/core';
import {MqttService, MqttConnectionState } from 'ngx-mqtt';
import { tap, map, distinctUntilChanged } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  constructor(private mqttService: MqttService) {

   }

   connect(){
    this.mqttService.connect();
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

   publish(topic: string, message: string){
    const observable = this.mqttService.publish(topic, message);
    observable.subscribe(()=>{console.log('Publisher sent:', message)});
    // Unsubscribe needed to prevent memory leak.
   }

   subscribe(topic: string){
    const observable$ = this.mqttService.observe(topic);
    return observable$;
   }

   disconnect(){
    this.mqttService.disconnect()
   }
}
