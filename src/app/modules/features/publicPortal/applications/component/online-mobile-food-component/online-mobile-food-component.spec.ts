import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnlineMobileFoodComponent } from './online-mobile-food-component';

describe('OnlineMobileFoodComponent', () => {
  let component: OnlineMobileFoodComponent;
  let fixture: ComponentFixture<OnlineMobileFoodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnlineMobileFoodComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OnlineMobileFoodComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
