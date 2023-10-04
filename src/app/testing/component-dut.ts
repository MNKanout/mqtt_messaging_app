import { NO_ERRORS_SCHEMA, Provider, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

export type ImportElement = any;
/**
 * This class provides a way to create a [Device under test](https://en.wikipedia.org/wiki/Device_under_test)
 * object that encapsulates the `component`, `fixture` and `page` variables for
 * a test file.
 *
 * While this by itself is slightly beneficial and will reduce the boiler plate
 * code in tests and increase consistency, the most significant benefit is that
 * it allows for delaying creating the component till inside the `it` function.
 *
 * This is an ABSOLUTE requirement in order to properly use a test scheduler and
 * simulate time. Because if a test configures a test scheduler after the
 * component is already created in `beforeEach`, then the component will already
 * have executed some of its lifetime within a different scheduler!
 *
 * Thus the only viable and reliable way to write tests that uses a test scheduler
 * is to make sure the component is not created before the test `it` function
 * starts.
 *
 * While tests that does not use a specific test scheduler might not strictly need
 * to use this DUT structure, doing so for them as well is beneficial since the
 * the code arguably becomes better and it is trivial to override a specific
 * provider for any individual test. With the old structure attempting to use
 * `TestBed.overrideProvider` will fail with *"Cannot override provider when the
 * test module has already been instantiated. Make sure you are not using `inject`
 * before `overrideProvider`"* and you are forced to use deprecated the `TestBed.get`
 * api.
 *
 * -----------
 *
 * Example usage. You create your specific `Dut` class for your test by providing
 * the specific component and page types. Then in your "global" setup you configure
 * the default set of providers while you can override any provider later inside
 * each test.
 *
 * ```typescript
 * class Dut extends ComponentDut<HelloWorldComponent, HelloWorldComponentPage> {
 *   constructor(providers: Provider[]) {
 *     super(HelloWorldComponent, providers);
 *   }
 *   override initialize() {
 *     return super.initialize(HelloWorldComponent, HelloWorldComponentPage);
 *   }
 * }
 *
 * describe('Hello world component', () => {
 *   let providers: Provider[];
 *
 *   beforeEach(() => {
 *     const greetingServiceSpy = createSpyFromClass(GreetingService);
 *     greetingServiceSpy.getGreeting.and.returnValue('Hello Test');
 *     providers = [
 *       { provide: GreetingService, useValue: greetingServiceSpy },
 *     ];
 *   });
 *
 *   it('should create', () => {
 *     // Arrange
 *     const dut = new Dut(providers);
 *
 *     // Act
 *     dut.initialize();  // <---- This is the key part, the component is first created inside the scope of the currently executed test.
 *
 *     // Assert
 *     expect(dut.component).toBeTruthy();
 *   });
 *
 *   it('should be trivial to override a provider', () => {
 *     // Arrange
 *     const downUnderSpy = createSpyFromClass(GreetingService);
 *     downUnderSpy.getGreeting.and.returnValue("G'day earth");
 *     const dut = new Dut([
 *       ...providers,
 *       { provide: GreetingService, useValue: downUnderSpy },
 *     ]).initialize();
 *
 *     // Act
 *     const message = dut.page.getMessage().textContent;
 *
 *     // Assert
 *     expect(message).toBe("G'day earth");
 *   });
 *
 * });
 * ```
 */
export class ComponentDut<TComp, TPage> {
  component: TComp;
  fixture: ComponentFixture<TComp>;
  page: TPage;
  private _initializeCalled = false;

  constructor(
    compCtor: Type<TComp>,
    providers: Provider[],
    imports: ImportElement[],
  ) {
    TestBed.configureTestingModule({
      imports: imports,
      declarations: [compCtor],
      providers: providers,
      schemas: [NO_ERRORS_SCHEMA], // We only test TComp, no dependencies.
    })
      .compileComponents();
    this.component = undefined as any;
    this.fixture = undefined as any;
    this.page = undefined as any;
  }

  initializeComp(
    compCtor: Type<TComp>,
    pageCtor: Type<TPage>,
  ) {
    if (this._initializeCalled) {
      throw new Error('initialize should only be called once!');
    }
    this._initializeCalled = true;
    this.fixture = TestBed.createComponent(compCtor);
    this.fixture.detectChanges(); // Will eventually trigger calling ngOnInit.
    this.component = this.fixture.componentInstance;
    this.page = new pageCtor(this.fixture);
    return this;
  }
}
