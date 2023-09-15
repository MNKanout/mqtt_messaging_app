import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { usernameRoutingVariable } from '../routes';
import { MessagingService } from '../messaging.service';
import { Message } from '../message.interface';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css']
})
export class MessagingComponent implements OnInit, OnDestroy {

  username: string | null = '';
  messages: Message[] = [];

  constructor(private route: ActivatedRoute,
    private messagingService: MessagingService,){
  }

  ngOnInit(): void {
    const routeParms = this.route.snapshot.paramMap;
    this.username = routeParms.get(usernameRoutingVariable);
  }

  ngOnDestroy(): void {
    this.messagingService.unsubscribe();
  }

  connect(){
    this.messagingService.connect();
    this.subscribe();
  }

  publish(message: string){
    this.messagingService.publish(message);
  }

  subscribe(){
    const observable$ = this.messagingService.subscribe();
    observable$.subscribe((msg)=>{
      this.messages.push(
        {'text': msg.payload.toString(),
        'topic': msg.topic,
      })
      // this.messages.push(msg.payload.toString())
      // console.log('Subscriber recieved:', payload)
    });
    // Unsubscribe needed to prevent memory leak
  }




}
