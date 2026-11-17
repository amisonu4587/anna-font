import { TestBed } from '@angular/core/testing';
import { InitialApplicationService } from './initial-application-service';

describe('InitialApplicationService', () => {
  let service: InitialApplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InitialApplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
