import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { usernameRoutingVariable } from '../routes';
import { MessagingService } from '../messaging.service';
import { Message } from '../message.interface';
import { Subject, takeUntil } from 'rxjs';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css']
})
export class MessagingComponent implements OnInit, OnDestroy {
  @ViewChild(SnackBarComponent) snackBarCompontent!: SnackBarComponent;

  username: string | null = '';
  messages: Message[] = [];
  currentTopic: string = '';
  newTopic: string = '';
  topics: string[] = [];
  destroyed$ = new Subject<void>();
  connectedStatus: string = '';

  
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

    this.disconnect();
  }

  onSubscribe(){
    this.subscribeToAllTopics();
  }

  disconnect(){
    this.messagingService.disconnect();
  }

  onNewTopic(){
    // Empty topic
    if (!this.newTopic) {
      this.snackBarCompontent.notfiyWarrning("Can't add an empty topic");
      return;
    }

    // Already added topic
    if (this.topics.includes(this.newTopic)){
      this.snackBarCompontent.notfiyWarrning('"'+this.newTopic +'"'+ ' is already added!');
      return;
    }
      
    
    this.topics.push(this.newTopic);
    if (this.topics.includes(this.newTopic)){
      this.snackBarCompontent.notfiySuccess('Added "'+ this.newTopic + '" successfully');
      this.newTopic = '';
    } else {
      this.snackBarCompontent.notfiyDanger('Was unable to add ' + this.newTopic);
    }
  }

  publish(message_text: string){
    const message: Message = {
      topic: this.currentTopic,
      text: message_text,
    }
    // Observable for sending messages
    const observable$ = this.messagingService.publish(message);
    observable$.
    pipe(
      takeUntil(this.destroyed$)
    ).subscribe();
  }

  subscribeToAllTopics(){
    // Observable for recieving messages
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