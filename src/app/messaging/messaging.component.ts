import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  currentTopic: string = 'channel_1';
  newTopic: string = '';
  topics: string[] = [];
  subscriptions: Subscription[] = [];
  connectedStatus: string = '';
  

  constructor(private route: ActivatedRoute,
    private messagingService: MessagingService,
    private router: Router){
  }

  ngOnInit(): void {
    // Getting data from active route
    const routeParms = this.route.snapshot.paramMap;
    this.username = routeParms.get(usernameRoutingVariable);

    // No username provided
    if (!this.username) {
      this.router.navigate(['not-found']);
    }

    // Connection observable
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
    this.disconnect();
  }

  onSubscribe(){
    this.messagingService.connect();
    this.subscribeToAllTopics();
  }

  disconnect(){
    for (let sub of this.subscriptions){
      sub.unsubscribe();
    }
    this.messagingService.disconnect();
  }

  onNewTopic(){
    this.topics.push(this.newTopic);
    this.newTopic = '';
    console.log(this.topics)
  }

  publish(message_text: string){
    const message: Message = {
      topic: this.currentTopic,
      text: message_text,
    }
    // Observable for sending messages
    const observable$ = this.messagingService.publish(message);
    const subscription = observable$.subscribe();
    this.subscriptions.push(subscription);
  }

  subscribeToAllTopics(){
    // Observable for recieving messages
    const observable$ = this.messagingService.subscribe(this.currentTopic);
    // Wait for an event, then do the following
    const subscription =  observable$.subscribe((event)=>{
      this.messages.push(
        {'text': new TextDecoder().decode(event.payload),
        'topic': event.topic,
      });
    });
    this.subscriptions.push(subscription);
  }
}