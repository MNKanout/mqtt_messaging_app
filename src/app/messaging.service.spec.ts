import { TestBed } from '@angular/core/testing';

// Third party
import { IMqttMessage, MqttModule, MqttService, MqttConnectionState } from 'ngx-mqtt';
import { createSpyFromClass } from 'jasmine-auto-spies';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { Subject } from 'rxjs';
import { AddObservableSpyMethods, ValueConfig, ValueConfigPerCall } from '@hirez_io/auto-spies-core';

// local 
import { MessagingService } from './messaging.service';
import { connection } from './mqtt.config';

class SubjectMqttConnectionState extends Subject<MqttConnectionState> implements AddObservableSpyMethods<MqttConnectionState> {
  nextWith(value?: MqttConnectionState | undefined): void {
    throw new Error('Method not implemented.');
  }
  nextOneTimeWith(value?: MqttConnectionState | undefined): void {
    throw new Error('Method not implemented.');
  }
  nextWithValues(valuesConfigs: ValueConfig<MqttConnectionState>[]): void {
    throw new Error('Method not implemented.');
  }
  nextWithPerCall(valuesPerCall?: ValueConfigPerCall<MqttConnectionState>[] | undefined): Subject<MqttConnectionState>[] {
    throw new Error('Method not implemented.');
  }
  throwWith(value: any): void {
    throw new Error('Method not implemented.');
  }
  returnSubject(): Subject<MqttConnectionState> {
    throw new Error('Method not implemented.');
  }
};

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

  it('Should get connection status', ()=>{
    // Arrange
    const state = new SubjectMqttConnectionState();
    mqttServiceSpy.state = state;

    // Act
    const connectionStatus$ = service.getConnectedStatus();
    const spySubscriber = subscribeSpyTo(connectionStatus$);
    state.next(MqttConnectionState.CONNECTED);
    state.next(MqttConnectionState.CONNECTED);
    state.next(MqttConnectionState.CONNECTING);
    state.next(MqttConnectionState.CLOSED);

    // Assert
    expect(spySubscriber.getValues()).toEqual([true, false]);
  });
});
