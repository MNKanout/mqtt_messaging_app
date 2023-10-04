import { Component, Injectable, Provider } from '@angular/core';
import { createSpyFromClass } from 'jasmine-auto-spies';

import { ComponentDut } from './component-dut';
import { ComponentPage } from './component-page';

@Injectable()
class GreetingService {
  private readonly greeting = 'Hello world';
  getGreeting() {
    return this.greeting;
  }
}

@Component({
  selector: 'isg-association-log',
  template: '<div id="message">{{message}}</div>',
  styles: ['#message { font-size: 5em }'],
})
class HelloWorldComponent {
  message: string;
  constructor(
    greetingService: GreetingService,
  ) {
    this.message = greetingService.getGreeting();
  }
}

class HelloWorldComponentPage extends ComponentPage<HelloWorldComponent> {
  getMessage() {
    return this.querySelector<HTMLDivElement>('#message');
  }
}

class Dut extends ComponentDut<HelloWorldComponent, HelloWorldComponentPage> {
  constructor(providers: Provider[]) {
    super(HelloWorldComponent, providers, []);
  }
  initialize() {
    return super.initializeComp(HelloWorldComponent, HelloWorldComponentPage);
  }
}

describe('Hello world component', () => {
  let providers: Provider[];

  beforeEach(() => {
    const greetingServiceSpy = createSpyFromClass(GreetingService);
    greetingServiceSpy.getGreeting.and.returnValue('Hello Test');
    providers = [
      { provide: GreetingService, useValue: greetingServiceSpy },
    ];
  });

  it('should create', () => {
    // Arrange
    const dut = new Dut(providers);

    // Act
    dut.initialize();  // <---- This is the key part, the component is first created inside the scope of the currently executed test.

    // Assert
    expect(dut.component).toBeTruthy();
  });

  it('should be trivial to override a provider', () => {
    // Arrange
    const downUnderSpy = createSpyFromClass(GreetingService);
    downUnderSpy.getGreeting.and.returnValue("G'day earth");
    const dut = new Dut([
      ...providers,
      { provide: GreetingService, useValue: downUnderSpy },
    ]).initialize();

    // Act
    const message = dut.page.getMessage().textContent;

    // Assert
    expect(message).toBe("G'day earth");
  });

});
