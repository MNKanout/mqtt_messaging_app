import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';

// Third party
import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import { RouterTestingModule } from '@angular/router/testing';
import {createSpyFromClass, Spy} from 'jasmine-auto-spies'; 
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
  let router: Router;
  let connectionStatusSubject: Subject<boolean>;
  let messagingServiceSpy: Spy<MessagingService>;

  beforeEach(() => {

    // Initialize component dependencies
    connectionStatusSubject = new Subject<boolean>();
    messagingServiceSpy = createSpyFromClass(MessagingService);

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
        FormsModule,
        MatInputModule,
        BrowserModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes(routes)
      ],
    });

    // Initialize component  
    fixture = TestBed.createComponent(MessagingComponent);
    component = fixture.componentInstance; // Component reference

    // Dependency injection
    messagingServiceSpy.getConnectedStatus.and.returnValue(connectionStatusSubject.asObservable());
    router = TestBed.inject(Router);

    // ngOnInit
    fixture.detectChanges();

  });

  it('should create', () => {
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
  }));

  it('Should display disconnected when connectionStatus is false', ()=>{
    // Arrange
    const connectionHeading: HTMLHeadingElement = fixture.debugElement.
    query(By.css('h3[id="connectionStatus"]')).nativeElement;

    // Act
    connectionStatusSubject.next(false);
    fixture.detectChanges();

    // Assert
    expect(connectionHeading.innerHTML).toBe('Disconnected');
  });
});
