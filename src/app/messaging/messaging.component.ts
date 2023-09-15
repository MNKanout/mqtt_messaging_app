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
  topic: string = 'channel_1';
  topics: string[] = [];
  subscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute,
    private messagingService: MessagingService,){
  }

  ngOnInit(): void {
    const routeParms = this.route.snapshot.paramMap;
    this.username = routeParms.get(usernameRoutingVariable);
  }

  ngOnDestroy(): void {
    this.disconnect();
  }

  connect(){
    this.messagingService.connect();
    this.subscribeToAllTopics();
  }

  disconnect(){
    for (let sub of this.subscriptions){
      sub.unsubscribe();
    }
    this.messagingService.disconnect();
  }

  addNewTopic(){
    this.topics.push(this.topic);
    this.topic = '';
    console.log(this.topics)
  }

  publish(message: string){
    const msg: Message = {
      topic: this.topic,
      text: message,
    }
    function myFunction(){console.log('Publisher sent:', message)};
    const observable$ = this.messagingService.publish(msg);
    const subscription = observable$.subscribe(myFunction);
    this.subscriptions.push(subscription);
  }

  subscribeToAllTopics(){
    const observable$ = this.messagingService.subscribe(this.topic);
    const subscription =  observable$.subscribe((msg)=>{
      this.messages.push(
        {'text': msg.payload.toString(),
        'topic': msg.topic,
      });
    });
    this.subscriptions.push(subscription);
  }




}
