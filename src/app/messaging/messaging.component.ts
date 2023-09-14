import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css']
})
export class MessagingComponent implements OnInit {

  username: string | null = '';

  constructor(private route: ActivatedRoute){
  }

  ngOnInit(): void {
    const routeParm = this.route.snapshot.paramMap;
    this.username = routeParm.get('username');
  }




}
