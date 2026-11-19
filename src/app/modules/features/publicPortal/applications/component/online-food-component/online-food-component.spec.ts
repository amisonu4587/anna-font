import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnlineFoodComponent } from './online-food-component';

describe('OnlineFoodComponent', () => {
  let component: OnlineFoodComponent;
  let fixture: ComponentFixture<OnlineFoodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnlineFoodComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OnlineFoodComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
