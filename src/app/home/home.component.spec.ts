import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { Location } from '@angular/common';
import {MatCardModule} from '@angular/material/card';

// Local
import {routes} from '../routes'
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports:[RouterTestingModule.withRoutes(routes),
        MatCardModule],
      providers:[Location],
    });
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain h3 welcome tag', () => {
    const h3Elem: HTMLHeadElement = fixture.debugElement.
    query(By.css('h3')).nativeElement;
    expect(h3Elem.innerHTML).toBe('Welcome to MQTT messaging app');
  });

  it('should contain p description tag ', () => {
    const h3Elem: HTMLParagraphElement = fixture.debugElement.
    query(By.css('p')).nativeElement;
    expect(h3Elem.innerHTML).toBe('Click the button bellow to get started');
  });
  
  it('Should have a get started button',()=>{
    const getStartedButton: HTMLButtonElement = fixture.debugElement.
    query(By.css('button')).nativeElement;
    expect(getStartedButton.innerHTML).toBe('GET STARTED');
  });

  it('Should be in the root route',()=>{
    const location: Location = TestBed.inject(Location);
    expect(location.path()).toBe('');
  });

  it('Should navigate to the login page when click get started',fakeAsync(()=>{
    const location: Location = TestBed.inject(Location);
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    button.click();
    tick();
    expect(location.path()).toBe('/login');
  }));
});
