import { TestBed } from '@angular/core/testing';

// Third party
import { MqttModule, MqttService } from 'ngx-mqtt';
import { createSpyFromClass } from 'jasmine-auto-spies';

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
    // Act 
    service.publish({topic:'test_topic',text:'test_text'})

    // Assert
    expect(mqttServiceSpy.publish).toHaveBeenCalled()
  })
});
