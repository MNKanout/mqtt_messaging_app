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
  selectedTopic: string = '';
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
    if (!this.selectedTopic) {
      this.notificationsComponent.notifyWarning('Please select a topic!');
      return;
    } 

    if (this.subscribedToTopics.includes(this.selectedTopic)){
      this.notificationsComponent.notifyWarning('Already subscribed to "' + this.selectedTopic + '"')
      return;
    }
    this.notificationsComponent.notifySuccess('Subscribed to "' + this.selectedTopic + '"');
    this.subscribedToTopics.push(this.selectedTopic); 
    this.subscribeToTopic();
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
    
    // Add topic
    this.topics.push(this.newTopic);
    this.notificationsComponent.notifySuccess('Added "'+ this.newTopic + '" successfully');
    this.newTopic = '';
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
    if (!this.subscribedToTopics.includes(this.selectedTopic)){
      this.notificationsComponent.notifyWarning('Not subscribed to "' + this.selectedTopic + '" yet!');
      return;
    }
    
    this.publish();
    this.notificationsComponent.notifySuccess('Message published!');
    this.textMessage = '';
  }

  publish(){
    const message: Message = {
      topic: this.selectedTopic,
      text: this.textMessage,
    }
    // Observable for sending messages
    const observable$ = this.messagingService.publish(message);
    observable$.
    pipe(
      takeUntil(this.destroyed$)
    ).subscribe();
  }

  subscribeToTopic(){
    // Observable for receiving messages
    const observable$ = this.messagingService.subscribe(this.selectedTopic);
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