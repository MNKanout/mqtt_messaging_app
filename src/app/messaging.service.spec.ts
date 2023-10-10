import { TestBed } from '@angular/core/testing';

// Third party
import { IMqttMessage, MqttModule, MqttService } from 'ngx-mqtt';
import { createSpyFromClass } from 'jasmine-auto-spies';
import { Subject } from 'rxjs';

// local 
import { MessagingService } from './messaging.service';
import { connection } from './mqtt.config';

describe('MessagingService', () => {
  let service: MessagingService;
  let mqttServiceSpy = createSpyFromClass(MqttService);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        MqttModule.forRoot(connection),
      ],
      providers:[
        {provide: MqttService, useValue:mqttServiceSpy},
      ]
    });
    service = TestBed.inject(MessagingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Should connect',()=>{
    // Act
    service.connect();

    // Assert
    expect(mqttServiceSpy.connect).toHaveBeenCalled();
  });

  it('Should disconnect',()=>{
    // Act
    service.disconnect();

    // Assert
    expect(mqttServiceSpy.disconnect).toHaveBeenCalled();
  });

  it('Should publish',()=>{
    // Arrange
    mqttServiceSpy.publish.and.returnValue(new Subject<void>());
    
    // Act 
    const publish$ = service.publish({topic:'test_topic',text:'test_text'});

    // Assert
    expect(mqttServiceSpy.publish).toHaveBeenCalledWith('test_topic','test_text');
    expect(publish$).toEqual(new Subject<void>());
  });

  it('Should subscribe',()=>{
    // Arrange
    mqttServiceSpy.observe.and.returnValue(new Subject<IMqttMessage>());

    // Act
    const subscribe$ = service.subscribe('test_topic');

    // Assert
    expect(mqttServiceSpy.observe).toHaveBeenCalledOnceWith('test_topic');
    expect(subscribe$).toEqual(new Subject<IMqttMessage>());
  });
});
