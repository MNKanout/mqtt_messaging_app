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
  currentTopic: string = 'channel_1';
  newTopic: string = '';
  topics: string[] = [];
  subscriptions: Subscription[] = [];
  connectedStatus: string = '';
  

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

  publish(message: string){
    const msg: Message = {
      topic: this.currentTopic,
      text: message,
    }
    function myFunction(){console.log('Publisher sent:', message)};
    const observable$ = this.messagingService.publish(msg);
    const subscription = observable$.subscribe(myFunction);
    this.subscriptions.push(subscription);
  }

  subscribeToAllTopics(){
    const observable$ = this.messagingService.subscribe(this.currentTopic);
    const subscription =  observable$.subscribe((msg)=>{
      this.messages.push(
        {'text': msg.payload.toString(),
        'topic': msg.topic,
      });
    });
    this.subscriptions.push(subscription);
  }




}
