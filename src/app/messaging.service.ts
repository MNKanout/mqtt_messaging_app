import { Injectable } from '@angular/core';
import {MqttService, MqttConnectionState } from 'ngx-mqtt';
import { tap, map, distinctUntilChanged } from 'rxjs';

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
