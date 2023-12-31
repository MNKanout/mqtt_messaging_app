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

class MessagingPage {

  constructor(private loader: HarnessLoader){}
  
  getConnectionHeading(){
    return document.querySelector('#connectionStatus') as HTMLHeadingElement;
  };

  getTopicInput(){
    return document.querySelector('#topic-input') as HTMLInputElement
  }

  setTopicInput(input: string){
   const topicInput = document.querySelector('#topic-input') as HTMLInputElement;
   topicInput.value = input;
   topicInput.dispatchEvent(new Event('input'));
  }

  AddTopicButton(){
    return document.querySelector('#add-topic-button') as HTMLButtonElement;
  }

  async getNotification(){
    const snackBar = await this.loader.getHarness(MatSnackBarHarness);
    return await snackBar.getMessage();
  }

  async getTopicOptions(){
    const select = await this.loader.getHarness(MatSelectHarness);
    await select.open();
    return await select.getOptions();
  }

  subscribeButton(){
    return document.querySelector('#subscribe-button') as HTMLButtonElement;
  }
}

describe('MessagingComponent', () => {
  let component: MessagingComponent;
  let fixture: ComponentFixture<MessagingComponent>;
  let router: Router;
  let connectionStatusSubject: Subject<boolean>;
  let messagingServiceSpy: Spy<MessagingService>;
  let loader: HarnessLoader;
  let messagingPage: MessagingPage;

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
    messagingPage = new MessagingPage(loader);

    // ngOnInit
    fixture.detectChanges();

  });

  fit('should create', () => {
    expect(component).toBeTruthy();
  });

  fit('Should navigate to /messaging/username when username is supplied',fakeAsync(()=> {
    router.navigate(['messaging', usernameRoutingVariable]);
    tick();
    const currentRoute = router.routerState.snapshot.url;
    expect(currentRoute).toBe('/messaging/username');
  }));

  fit('Should render 404 when username is not supplied', fakeAsync(()=>{
    router.navigate(['/messaging']);
    tick();
    const currentRoute = router.routerState.snapshot.url;
    expect(currentRoute).toBe('/not-found');
  }));

  fit('Should display disconnected when connectionStatus is false', ()=>{
    // Arrange
    const connectionHeading = messagingPage.getConnectionHeading();

    // Act
    connectionStatusSubject.next(false);
    fixture.detectChanges();

    // Assert
    expect(connectionHeading.innerHTML).toBe('Disconnected');
  });

  fit('Should display connected when connectionStatus is true', ()=>{
    // Arrange
    const connectionHeading = messagingPage.getConnectionHeading();

    // Act
    connectionStatusSubject.next(true);
    fixture.detectChanges();

    // Assert
    expect(connectionHeading.innerHTML).toBe('Connected');
  });

  fit('Should bound topic-input to newTopic variable', ()=> {
    // Act
    messagingPage.setTopicInput('test_channel');
    fixture.detectChanges();

    // Assert
    expect(component.newTopic).toBe('test_channel');
  });

  fit('Should notify when adding an new empty topic', async()=> {
    // Act
    messagingPage.AddTopicButton().click();

    // Assert
    expect(await messagingPage.getNotification()).toContain("Can't add an empty topic");
  });

  fit('Should notify when adding a topic that has already been added', async ()=> {
    // Arrange
    component.topics = ['test_topic'];

    // Act
    messagingPage.setTopicInput('test_topic');
    messagingPage.AddTopicButton().click();

    // Assert
    expect(await messagingPage.getNotification()).toContain('"'+ component.newTopic +'"'+ ' is already added!');
  });

  fit('Should add newTopic to topics when add-topic-button is clicked', ()=> {
    // Arrange 
    component.newTopic = 'test-topic';

    // Act
    messagingPage.AddTopicButton().click();
    fixture.detectChanges();

    // Assert
    expect(component.topics).toContain('test-topic');
  });

  fit('Should set newTopic to "" when add-topic-button is clicked', ()=> {
    // Arrange
    component.newTopic = 'test-topic';

    // Act
    messagingPage.AddTopicButton().click();
    fixture.detectChanges();

    // Assert
    expect(component.newTopic).toBe("");
  });

  fit('Should dynamically display topics in the select element', async ()=>{
    // Arrange
    component.topics = ['test_channel_1','test_channel_2','test_channel_3']
    fixture.detectChanges();

    // Act
    const options = await messagingPage.getTopicOptions();

    // Assert
    expect(await options[0].getText()).toEqual('test_channel_1');
    expect(await options[1].getText()).toEqual('test_channel_2');
    expect(await options[2].getText()).toEqual('test_channel_3');
  });

  fit('Should notify when topic is not selected and subscribe button is clicked', async ()=>{
    // Act 
    messagingPage.subscribeButton().click()

    // Assert
    expect(await messagingPage.getNotification()).toBe('Please select a topic!');
  });

  fit('Should notify when topic is already subscribed to and subscribe button is clicked', async ()=>{
    // Arrange
    component.topics = ['test_topic'];
    component.subscribedToTopics = ['test_topic'];
    const options = await messagingPage.getTopicOptions();

    // Act 
    await options[0].click();
    messagingPage.subscribeButton().click()

    // Assert
    expect(await messagingPage.getNotification()).toBe('Already subscribed to "' + component.selectedTopic + '"');
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
    expect(await snackBar.getMessage()).toBe('Subscribed to "' + component.selectedTopic + '"');
  });

  it('Should notify when publishing an empty message', async ()=>{
    // Arrange
    const button = fixture.debugElement.query(By.css('#publish-button')).nativeElement;

    // Act
    button.click()
    const snackBar = await loader.getHarness(MatSnackBarHarness);

    // Assert
    expect(await snackBar.getMessage()).toEqual('Please enter a message!');
  });

  it('Should notify when publishing a message without subscribing to any message', async ()=>{
    // Arrange
    const button: HTMLButtonElement = fixture.debugElement.query(By.css('#publish-button')).nativeElement;
    const input: HTMLInputElement = fixture.debugElement.query(By.css('#message-text')).nativeElement;

    // Act
    input.value = 'test_message';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    button.click();
    const snackBar = await loader.getHarness(MatSnackBarHarness);

    // Assert
    expect(await snackBar.getMessage()).toEqual('Not subscribed to any topic yet!');
  });

  it('Should notify when publishing to a topic that is not subscribed to', async ()=>{
    // Arrange
    component.topics = ['test_topic_1'];
    component.subscribedToTopics = ['test_topic_2'];
    const button: HTMLButtonElement = fixture.debugElement.query(By.css('#publish-button')).nativeElement;
    const input: HTMLInputElement = fixture.debugElement.query(By.css('#message-text')).nativeElement;
    const select: MatSelectHarness = await loader.getHarness(MatSelectHarness);

    // Act
    await select.open();
    const options = await select.getOptions();
    await options[0].click();
    fixture.detectChanges();
    input.value = 'test_message';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    button.click();
    const snackBar = await loader.getHarness(MatSnackBarHarness);

    // Assert
    expect(await snackBar.getMessage()).toEqual('Not subscribed to "' + component.selectedTopic + '" yet!');
  });

  it('Should push new message when subscribeToAll method is called',()=>{
    // Arrange
    const topicObservable$ = new Subject<IMqttMessage>();
    messagingServiceSpy.subscribe.and.returnValue(topicObservable$.asObservable());
    const mqttObject: IMqttMessage = createIMqttMessage('test_channel','test_text');

    // Act
    component.subscribeToTopic();
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
    component.selectedTopic = message.topic; // Select topic
    component.subscribedToTopics.push(component.selectedTopic); // Subscribe to topic
    input.value = message.text; // Add text message
    input.dispatchEvent(event);
    button.click();

    // Assert
    expect(messagingServiceSpy.publish).toHaveBeenCalledWith(message);
  });
});