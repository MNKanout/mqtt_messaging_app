import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {HarnessLoader} from '@angular/cdk/testing';
import {MatSnackBarHarness} from '@angular/material/snack-bar/testing';

// Local
import { LoginComponent } from './login.component';
import { routes } from '../routes';
import { NotificationsComponent } from '../notifications/notifications.component';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent, NotificationsComponent],
      imports: [
        RouterTestingModule.withRoutes(routes),
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        FormsModule,
      ],
      providers:[MatSnackBar]
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    router.initialNavigation();
    fixture.detectChanges();

    loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be at /login route', fakeAsync(() => {
    router.navigate(['login']);
    tick();
    const currentRoute = router.routerState.snapshot.url;
    expect(currentRoute).toBe('/login');
  }));

  it('Should have username input field', () => {
    const inputField: HTMLInputElement = fixture.debugElement.
      query(By.css('input')).nativeElement;
    expect(inputField.name).toBe('username');
  });

  it('Should have login button', () => {
    const button: HTMLButtonElement = fixture.debugElement.
      query(By.css('button')).nativeElement;
    expect(button.innerHTML).toBe('Login');
  });

  it('Should navigate to messaging component when login button clicked with a name supplied',
    fakeAsync(() => {
      const button: HTMLButtonElement = fixture.debugElement.
        query(By.css('button')).nativeElement;
      const input: HTMLInputElement = fixture.debugElement.
        query(By.css('input')).nativeElement;

      component.username = 'dummyName';
      button.click();
      tick();

      const currentRoute = router.routerState.snapshot.url;
      expect(currentRoute).toBe('/messaging/dummyName');
    }));

    it('Should alert when login button clicked without a supplied name', async() => {
      const button: HTMLButtonElement = fixture.debugElement.
        query(By.css('button')).nativeElement;

      await button.click();
      let snackBar = await loader.getHarness(MatSnackBarHarness)
      expect(await snackBar.getMessage()).toBe('Please enter a username!')
    });

    it('Should have only one login card', ()=> {
      const cards: MatCardModule[] = fixture.debugElement.
      queryAll(By.css('mat-card'));
      expect(cards.length).toBe(1);
    });
});