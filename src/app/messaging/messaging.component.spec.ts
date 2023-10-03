import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

// Third party
import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute} from '@angular/router';
import {createSpyFromClass} from 'jasmine-auto-spies'; 
import { Subject } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';

// local
import { MessagingComponent } from './messaging.component';
import { MessagingService } from '../messaging.service';
import { routes, usernameRoutingVariable } from '../routes';


describe('MessagingComponent', () => {
  let component: MessagingComponent;
  let fixture: ComponentFixture<MessagingComponent>;
  let route: ActivatedRoute;
  let router: Router;

  beforeEach(() => {

    const messagingServiceSpy = createSpyFromClass(MessagingService);

    TestBed.configureTestingModule({
      declarations: [MessagingComponent],
      providers: [
        {provide: MessagingService, useValue: messagingServiceSpy},
      ],
      imports: [
        MatDividerModule,
        MatFormFieldModule,
        MatSelectModule,
        MatTabsModule,
        RouterTestingModule,
        FormsModule,
        MatInputModule,
        BrowserModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes(routes)
      ],
    });
    fixture = TestBed.createComponent(MessagingComponent);
    component = fixture.componentInstance;

    const subject = new Subject<boolean>()
    messagingServiceSpy.getConnectedStatus.and.returnValue(subject.asObservable());
    subject.next(true)

    fixture.detectChanges();
    route = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    router.initialNavigation();
  });

  it('should create', () => {
    const spyRoute = spyOn(route.snapshot.paramMap, 'get')
    spyRoute.and.returnValue(usernameRoutingVariable);
    expect(component).toBeTruthy();
  });

  it('Should navigate to /messaging/username when username is supplied',fakeAsync(()=> {
    router.navigate(['messaging', usernameRoutingVariable]);
    tick();
    const currentRoute = router.routerState.snapshot.url;
    expect(currentRoute).toBe('/messaging/username');
  }));

  it('Should render 404 when username is not supplied', fakeAsync(()=>{
    router.navigate(['/messaging']);
    tick();
    const currentRoute = router.routerState.snapshot.url;
    expect(currentRoute).toBe('/not-found');
  }))
});
