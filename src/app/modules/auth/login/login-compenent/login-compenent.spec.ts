import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginCompenent } from './login-compenent';

describe('LoginCompenent', () => {
  let component: LoginCompenent;
  let fixture: ComponentFixture<LoginCompenent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginCompenent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginCompenent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
