import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { usernameRoutingVariable } from '../routes';
import { MessagingService } from '../messaging.service';
import { Message } from '../message.interface';
import { Subject, takeUntil } from 'rxjs';
import { NotificationsComponent } from '../notifications/notifications.component';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css']
})
export class MessagingComponent implements OnInit, OnDestroy {
  @ViewChild(NotificationsComponent) notificationsComponent!: NotificationsComponent;

  username: string | null = '';
  messages: Message[] = [];
  currentTopic: string = '';
  newTopic: string = '';
  topics: string[] = [];
  destroyed$ = new Subject<void>();
  connectedStatus: string = '';
  subscribedToTopics: string[] = [];
  textMessage: string = '';

  
  constructor(private route: ActivatedRoute,
    private messagingService: MessagingService,
    private router: Router){
  }

  ngOnInit(): void {
    this.messagingService.connect();
    
    // Getting data from active route
    const routeParms = this.route.snapshot.paramMap;
    this.username = routeParms.get(usernameRoutingVariable);

    // No username provided
    if (!this.username) {
      this.router.navigate(['not-found']);
    }

    // Connection observable
    const statusObservable$ = this.messagingService.getConnectedStatus();
    statusObservable$
      .pipe(
        takeUntil(this.destroyed$)
      )
      .subscribe((isConnected)=>{
        if (isConnected){
          this.connectedStatus = 'Connected';
        } else {
          this.connectedStatus = 'Disconnected';
        }
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe observables
    this.destroyed$.next();
    this.destroyed$.complete();

    this.messagingService.disconnect();
  }

  onSubscribe(){
    if (!this.currentTopic) {
      this.notificationsComponent.notifyWarning('Please select a topic!');
      return;
    } 

    if (this.subscribedToTopics.includes(this.currentTopic)){
      this.notificationsComponent.notifyWarning('Already subscribed to "' + this.currentTopic + '"')
      return;
    }
    this.notificationsComponent.notifySuccess('Subscribed to "' + this.currentTopic + '"');
    this.subscribedToTopics.push(this.currentTopic); 
    this.subscribeToCurrentTopic();
    }

  onNewTopic(){
    // Empty topic
    if (!this.newTopic) {
      this.notificationsComponent.notifyWarning("Can't add an empty topic");
      return;
    }

    // Already added topic
    if (this.topics.includes(this.newTopic)){
      this.notificationsComponent.notifyWarning('"'+this.newTopic +'"'+ ' is already added!');
      return;
    }
      
    
    this.topics.push(this.newTopic);
    if (this.topics.includes(this.newTopic)){
      this.notificationsComponent.notifySuccess('Added "'+ this.newTopic + '" successfully');
      this.newTopic = '';
    } else {
      this.notificationsComponent.notifyDanger('Was unable to add ' + this.newTopic);
    }
  }

  onPublish(){
    // Empty text message
    if(!this.textMessage){
      this.notificationsComponent.notifyWarning('Please enter a message!');
      return;
    }

    // Not subscribed to any topic
    if (this.subscribedToTopics.length === 0){
      this.notificationsComponent.notifyWarning('Not subscribed to any topic yet!');
      return;
    }

    // Not subscribed to selected topic
    if (!this.subscribedToTopics.includes(this.currentTopic)){
      this.notificationsComponent.notifyWarning('Not subscribed to "' + this.currentTopic + '" yet!');
      return;
    }
    
    this.publish();
    this.notificationsComponent.notifySuccess('Message published!');
    this.textMessage = '';
  }

  publish(){
    const message: Message = {
      topic: this.currentTopic,
      text: this.textMessage,
    }
    // Observable for sending messages
    const observable$ = this.messagingService.publish(message);
    observable$.
    pipe(
      takeUntil(this.destroyed$)
    ).subscribe();
  }

  subscribeToCurrentTopic(){
    // Observable for receiving messages
    const observable$ = this.messagingService.subscribe(this.currentTopic);
    observable$
    .pipe(
      takeUntil(this.destroyed$)
    )
    .subscribe((event)=>{
      this.messages.push(
        {'text': new TextDecoder().decode(event.payload),
        'topic': event.topic,
      });
    });
  }
}