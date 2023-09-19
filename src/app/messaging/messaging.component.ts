import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { usernameRoutingVariable } from '../routes';
import { MessagingService } from '../messaging.service';
import { Message } from '../message.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css']
})
export class MessagingComponent implements OnInit, OnDestroy {

  username: string | null = '';
  messages: Message[] = [];
  subscriptions: Subscription[] = [];
  connectedStatus: string = '';
  subscribeButton: string = 'Subscribe';
  topic: string = 'channel_1';
  

  constructor(private route: ActivatedRoute,
    private messagingService: MessagingService,){
  }

  ngOnInit(): void {
    // Getting data from active route
    const routeParms = this.route.snapshot.paramMap;
    this.username = routeParms.get(usernameRoutingVariable);
    // 
    const statusObservable$ = this.messagingService.getConnectedStatus();
    const subscription = statusObservable$.subscribe((isConnected)=>{
      if (isConnected){
        this.connectedStatus = 'Connected';
      } else {
        this.connectedStatus = 'Disconnected';
      }
    });
    this.subscriptions.push(subscription);
  }

  ngOnDestroy(): void {
    for(let sub of this.subscriptions){
      sub.unsubscribe();
    }
    this.messagingService.disconnect();
  }

  onSubscribe(){
    this.subscribe();
    console.log('Subscribed to:' + this.topic)
    console.log(this.subscriptions);
  }

  publish(message: string){
    this.messagingService.publish(this.topic, message);
  }

  subscribe(){
    const observable$ = this.messagingService.subscribe(this.topic);
    const subscription = observable$.subscribe((msg)=>{
      this.messages.push(
        {'text': msg.payload.toString(),
        'topic': msg.topic,
      })
    });
    this.subscriptions.push(subscription);
  }




}
