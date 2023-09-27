import { TestBed } from '@angular/core/testing';

import { MessagingService } from './messaging.service';
import { IMqttServiceOptions, MqttModule } from 'ngx-mqtt';
import { connection } from './mqtt.config';

describe('MessagingService', () => {
  let service: MessagingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        MqttModule.forRoot(connection),
      ]
    });
    service = TestBed.inject(MessagingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
