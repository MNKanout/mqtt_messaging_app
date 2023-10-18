import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

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
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBarHarness } from '@angular/material/snack-bar/testing';
import {MatSelectHarness} from '@angular/material/select/testing';

// local
import { MessagingComponent } from './messaging.component';
import { MessagingService } from '../messaging.service';
import { routes, usernameRoutingVariable } from '../routes';
import { Message } from '../message.interface';
import { IMqttMessage } from 'ngx-mqtt';
import { NotificationsComponent } from '../notifications/notifications.component';

function createIMqttMessage(topic:string, text:string): IMqttMessage {
  return {
    topic: topic,
    payload: new TextEncoder().encode(text),
    qos: 0,
    retain: true,
    dup: false,
    cmd: 'publish'
  };
}

describe('MessagingComponent', () => {
  let component: MessagingComponent;
  let fixture: ComponentFixture<MessagingComponent>;
  let router: Router;
  let connectionStatusSubject: Subject<boolean>;
  let messagingServiceSpy: Spy<MessagingService>;
  let loader: HarnessLoader;

  beforeEach(() => {

    // Initialize component dependencies
    connectionStatusSubject = new Subject<boolean>();
    messagingServiceSpy = createSpyFromClass(MessagingService);

    TestBed.configureTestingModule({
      declarations: [MessagingComponent, NotificationsComponent],
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
        RouterTestingModule.withRoutes(routes),
        MatSnackBarModule,
      ],
    });

    // Initialize component  
    fixture = TestBed.createComponent(MessagingComponent);
    component = fixture.componentInstance; // Component reference

    // Dependency injection
    messagingServiceSpy.getConnectedStatus.and.returnValue(connectionStatusSubject.asObservable());
    router = TestBed.inject(Router);
    loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

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

  it ('Should notify when adding an new empty topic', async()=> {
    // Arrange 
    const button: HTMLButtonElement = fixture.debugElement.query(By.css("#add-topic-button")).nativeElement;

    // Act
    await button.click();
    const snackBar = await loader.getHarness(MatSnackBarHarness);

    // Assert
    expect(await snackBar.getMessage()).toContain("Can't add an empty topic");
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

  it('Should notify when topic is not selected and subscribe button is clicked', async ()=>{
    // Arrange
    const button: HTMLButtonElement = fixture.debugElement.query(By.css('#subscribe-button')).nativeElement;

    // Act 
    await button.click()
    let snackBar = await loader.getHarness(MatSnackBarHarness);

    // Assert
    expect(await snackBar.getMessage()).toBe('Please select a topic!');
  });

  it('Should notify when topic is already subscribed to and subscribe button is clicked', async ()=>{
    // Arrange
    component.topics = ['test_topic'];
    component.subscribedToTopics = ['test_topic'];
    const button: HTMLButtonElement = fixture.debugElement.query(By.css('#subscribe-button')).nativeElement;
    const select = await loader.getHarness(MatSelectHarness);

    // Act 
    await select.open();
    const options = await select.getOptions();
    await options[0].click();
    await button.click()
    const snackBar = await loader.getHarness(MatSnackBarHarness);

    // Assert
    expect(await snackBar.getMessage()).toBe('Already subscribed to "' + component.currentTopic + '"');
  });

  it('Should subscribe to non-empty topic when subscribe button is clicked', async ()=>{
    // Arrange
    component.topics = ['test_topic'];
    const button: HTMLButtonElement = fixture.debugElement.query(By.css('#subscribe-button')).nativeElement;
    const select = await loader.getHarness(MatSelectHarness);
    fixture.detectChanges();

    // Act
    await select.open();
    const options = await select.getOptions();
    await options[0].click();
    await button.click();
    const snackBar = await loader.getHarness(MatSnackBarHarness);

    // Assert
    expect(messagingServiceSpy.subscribe).toHaveBeenCalled();
    expect(component.subscribedToTopics).toContain('test_topic');
    expect(await snackBar.getMessage()).toBe('Subscribed to "' + component.currentTopic + '"');
  });

  it('Should push new message when subscribeToAll method is called',()=>{
    // Arrange
    const topicObservable$ = new Subject<IMqttMessage>();
    messagingServiceSpy.subscribe.and.returnValue(topicObservable$.asObservable());
    const mqttObject: IMqttMessage = createIMqttMessage('test_channel','test_text');

    // Act
    component.subscribeToCurrentTopic();
    topicObservable$.next(mqttObject);

    // Assert
    expect(component.messages).toEqual([{'topic':'test_channel','text':'test_text'}]);
  });

  it('Should call publish method when publish button is clicked', ()=>{
    // Arrange
    const publishObservable$ = new Subject<void>();
    messagingServiceSpy.publish.and.returnValue(publishObservable$);
    const message: Message = {topic:'test_topic', text:'test_text'};
    const button: HTMLButtonElement = fixture.debugElement.query(By.css('#publish-button')).nativeElement;
    const input: HTMLInputElement = fixture.debugElement.query(By.css('#message-text')).nativeElement;
    const event = new InputEvent('input');

    // Act
    component.currentTopic = message.topic; // Select topic
    component.subscribedToTopics.push(component.currentTopic); // Subscribe to topic
    input.value = message.text; // Add text message
    input.dispatchEvent(event);
    button.click();

    // Assert
    expect(messagingServiceSpy.publish).toHaveBeenCalledWith(message);
  });
});