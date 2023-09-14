import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { usernameRoutingVariable } from '../routes';
import { MessagingService } from '../messaging.service';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css']
})
export class MessagingComponent implements OnInit {

  username: string | null = '';

  constructor(private route: ActivatedRoute,
    private messagingService: MessagingService,){
  }

  ngOnInit(): void {
    const routeParms = this.route.snapshot.paramMap;
    this.username = routeParms.get(usernameRoutingVariable);
  }

  connect(){
    this.messagingService.connect()
    this.subscribe();
  }

  publish(message: string){
    console.log(message)
    this.messagingService.publish(message)
  }
  subscribe(){
    const observable$ = this.messagingService.subscribe();
    observable$.subscribe((msg)=>{console.log('Subscriber is called', msg.payload.toString())});
    // Unsubscribe needed to prevent memory leak
  }




}
