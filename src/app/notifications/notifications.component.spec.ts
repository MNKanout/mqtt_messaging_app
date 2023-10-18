import { ComponentFixture, TestBed } from '@angular/core/testing';

// Third-party
import { MatSnackBar } from '@angular/material/snack-bar';

// Local
import { NotificationsComponent } from './notifications.component';

describe('SnackBarComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationsComponent],
      providers: [MatSnackBar],
    });
    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
