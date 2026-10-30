import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InitialApplicationComponent } from './initial-application-component';

describe('InitialApplicationComponent', () => {
  let component: InitialApplicationComponent;
  let fixture: ComponentFixture<InitialApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InitialApplicationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InitialApplicationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
