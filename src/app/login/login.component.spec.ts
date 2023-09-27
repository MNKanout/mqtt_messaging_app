import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

// Local
import { LoginComponent } from './login.component';
import {routes} from '../routes'
import { By } from '@angular/platform-browser';


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;


  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports:[RouterTestingModule.withRoutes(routes)],
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it ('should be at /login route', fakeAsync(()=>{
    const router: Router = TestBed.inject(Router);
    router.initialNavigation();
    router.navigate(['login']);
    tick();
    const currentRoute = router.routerState.snapshot.url;
    expect(currentRoute).toBe('/login');
  }));

  it('Should have username input field',()=> {
    const inputField: HTMLInputElement = fixture.debugElement.
    query(By.css('input')).nativeElement;
    expect(inputField.name).toBe('username');
  })
});
