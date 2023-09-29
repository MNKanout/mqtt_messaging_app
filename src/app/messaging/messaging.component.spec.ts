import { ComponentFixture, TestBed } from '@angular/core/testing';

// Third party
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute} from '@angular/router';
import {createSpyFromClass} from 'jasmine-auto-spies'; 

// local
import { MessagingComponent } from './messaging.component';
import { MessagingService } from '../messaging.service';
import { usernameRoutingVariable } from '../routes';


describe('MessagingComponent', () => {
  let component: MessagingComponent;
  let fixture: ComponentFixture<MessagingComponent>;
  let route: ActivatedRoute;

  beforeEach(() => {

    const messagingServiceSpy = createSpyFromClass(MessagingService);

    TestBed.configureTestingModule({
      declarations: [MessagingComponent],
      providers: [
        {provide: MessagingService, useValue: messagingServiceSpy},
      ],
      imports: [
        RouterTestingModule,
      ],
    });
    fixture = TestBed.createComponent(MessagingComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    route = TestBed.inject(ActivatedRoute);
  });

  it('should create', () => {
    const spyRoute = spyOn(route.snapshot.paramMap, 'get')
    spyRoute.and.returnValue(usernameRoutingVariable);
    expect(component).toBeTruthy();
  });
});
