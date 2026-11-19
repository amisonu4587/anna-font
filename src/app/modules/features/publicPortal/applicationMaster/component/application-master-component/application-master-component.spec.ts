import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicationMasterComponent } from './application-master-component';

describe('ApplicationMasterComponent', () => {
  let component: ApplicationMasterComponent;
  let fixture: ComponentFixture<ApplicationMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationMasterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicationMasterComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
