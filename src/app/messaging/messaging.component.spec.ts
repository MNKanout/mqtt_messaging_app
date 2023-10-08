import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { Provider } from '@angular/core';

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
import { ComponentDut, ImportElement } from '../testing/component-dut';
import { ComponentPage } from '../testing/component-page';

class MessagingPage extends ComponentPage<MessagingComponent> {
  getConnectionStatusHeading(){
    return this.querySelector<HTMLHeadingElement>('#connectionStatus');
  }
}

class Dut extends ComponentDut<MessagingComponent, MessagingPage> {
  constructor(
    providers: Provider[],
    imports: ImportElement[],
  ){
    super(MessagingComponent, providers, imports);
  }
  initialize(){
    super.initializeComp(MessagingComponent, MessagingPage);
  }
}


describe('MessagingComponent', () => {
  let component: MessagingComponent;
  let fixture: ComponentFixture<MessagingComponent>;
  let router: Router;
  let connectionStatusSubject: Subject<boolean>;
  let messagingServiceSpy: Spy<MessagingService>;
  let providers: Provider[];
  let imports: ImportElement[];
  beforeEach(() => {

    // Initialize component dependencies
    connectionStatusSubject = new Subject<boolean>();
    messagingServiceSpy = createSpyFromClass(MessagingService);

    providers = [
      {provide: MessagingService, useValue: messagingServiceSpy},
    ];
    imports = [
      MatDividerModule,
      MatFormFieldModule,
      MatSelectModule,
      MatTabsModule,
      FormsModule,
      MatInputModule,
      BrowserModule,
      BrowserAnimationsModule,
      RouterTestingModule.withRoutes(routes),
    ];

    // TestBed.configureTestingModule({
    //   declarations: [MessagingComponent],
    //   providers: providers,
    //   imports: imports,
    // });
    // fixture = TestBed.createComponent(MessagingComponent);
    // component = fixture.componentInstance;

    // const connectionStatusSubject = new Subject<boolean>()
    // messagingServiceSpy.getConnectedStatus.and.returnValue(connectionStatusSubject.asObservable());
    // connectionStatusSubject.next(false);

    // fixture.detectChanges();
    // router = TestBed.inject(Router);
  });
  fit('should create', () => {
    // Arrange
    const dut = new Dut(providers, imports);
    messagingServiceSpy.getConnectedStatus.and.returnValue(connectionStatusSubject.asObservable());
    dut.initialize();

    // Act
    connectionStatusSubject.next(false);

    // Assert
    expect(dut).toBeTruthy();
  });

  it('Should navigate to /messaging/username when username is supplied', fakeAsync(()=> {
    router.navigate(['messaging', usernameRoutingVariable]);
    tick();
    const currentRoute = router.routerState.snapshot.url;
    expect(currentRoute).toBe('/messaging/username');
  }));

  it('Should render 404 when username is not supplied', fakeAsync(()=>{
    router.navigate(['/messaging/']);
    tick();
    const currentRoute = router.routerState.snapshot.url;
    expect(currentRoute).toBe('/not-found');
  }));

  fit('Should display disconnected when connectionStatus is false', ()=>{
    // Arrange
    const dut = new Dut(providers, imports);
    messagingServiceSpy.getConnectedStatus.and.returnValue(connectionStatusSubject.asObservable());
    dut.initialize();

    // Act
    connectionStatusSubject.next(false);
    dut.fixture.detectChanges();
    const connectionHeading = dut.page.getConnectionStatusHeading().innerText;

    // Assert
    expect(connectionHeading).toEqual('Disconnected');
  });

  fit('Should display connected when connectionStatus is true', ()=>{
    // Arrange
    const dut = new Dut(providers, imports);
    messagingServiceSpy.getConnectedStatus.and.returnValue(connectionStatusSubject.asObservable());
    dut.initialize();

    // Act
    connectionStatusSubject.next(true);
    dut.fixture.detectChanges();
    const connectionHeading = dut.page.getConnectionStatusHeading().innerText;

    // Assert
    expect(connectionHeading).toEqual('Connected');
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

  it('Should add newTopic to topics when add-topic-button is clicked', ()=> {
    // Arrange 
    const button: HTMLButtonElement = fixture.debugElement.query(By.css('button[id="add-topic-button"]')).nativeElement;
    component.newTopic = 'test-topic';

    // Act
    button.click();
    fixture.detectChanges();

    // Assert
    expect(component.topics).toContain('test-topic');
  });

  it('Should set newTopic to "" when add-topic-button is clicked', ()=> {
    // Arrange
    const button: HTMLButtonElement = fixture.debugElement.query(By.css('button[id="add-topic-button"]')).nativeElement;

    // Act
    component.newTopic = 'test-topic';
    button.click();
    fixture.detectChanges();

    // Assert
    expect(component.newTopic).toBe("");
  });
});
