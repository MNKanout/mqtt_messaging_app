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

  it('Should display connected when connectionStatus is true', ()=>{
    // Arrange
    const connectionHeading: HTMLHeadingElement = fixture.debugElement.
    query(By.css('h3[id="connectionStatus"]')).nativeElement;

    // Act
    connectionStatusSubject.next(true);
    fixture.detectChanges();

    // Assert
    expect(connectionHeading.innerHTML).toBe('Connected');
  });

  it('Should bound topic-input to newTopic variable', ()=> {
    // Arrange
    const topicInput: HTMLInputElement = fixture.debugElement.query(By.css('input[id="topic-input"]')).nativeElement;
    
    // Act
    topicInput.value = 'test_channel';
    topicInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Assert
    expect(component.newTopic).toBe('test_channel');
  });

  it ('Should add newTopic to topics when add-topic-button is clicked', ()=> {
    // Arrange 
    const button: HTMLButtonElement = fixture.debugElement.query(By.css('button[id="add-topic-button"]')).nativeElement;
    component.newTopic = 'test-topic';

    // Act
    button.click();
    fixture.detectChanges();

    // Assert
    expect(component.topics).toContain('test-topic');
  });

  it ('Should set newTopic to "" when add-topic-button is clicked', ()=> {
    // Arrange
    const button: HTMLButtonElement = fixture.debugElement.query(By.css('button[id="add-topic-button"]')).nativeElement;

    // Act
    component.newTopic = 'test-topic';
    button.click();
    fixture.detectChanges();

    // Assert
    expect(component.newTopic).toBe("");
  });

  it('Should dynamically display topics in the select element', ()=>{
    // Arrange
    const trigger = fixture.debugElement.query(By.css('mat-select')).nativeElement;
    component.topics = ['test_channel_1','test_channel_2','test_channel_3']
    fixture.detectChanges();

    // Act
    trigger.click();
    fixture.detectChanges();
    const options = fixture.debugElement.queryAll(By.css('mat-option'));

    // Assert
    expect(options[0].nativeElement.innerText).toEqual('test_channel_1');
    expect(options[1].nativeElement.innerText).toEqual('test_channel_2');
    expect(options[2].nativeElement.innerText).toEqual('test_channel_3');
  });
});
