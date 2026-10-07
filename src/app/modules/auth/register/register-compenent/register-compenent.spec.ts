import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterCompenent } from './register-compenent';

describe('RegisterCompenent', () => {
  let component: RegisterCompenent;
  let fixture: ComponentFixture<RegisterCompenent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterCompenent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterCompenent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
