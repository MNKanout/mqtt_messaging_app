import { ComponentFixture, TestBed } from '@angular/core/testing';

// Third-party
import { MatSnackBar } from '@angular/material/snack-bar';

// Local
import { SnackBarComponent } from './snack-bar.component';

describe('SnackBarComponent', () => {
  let component: SnackBarComponent;
  let fixture: ComponentFixture<SnackBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SnackBarComponent],
      providers: [MatSnackBar],
    });
    fixture = TestBed.createComponent(SnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
