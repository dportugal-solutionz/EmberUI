import { TestBed } from '@angular/core/testing';

import { CongiruationService } from './congiruation.service';

describe('CongiruationService', () => {
  let service: CongiruationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CongiruationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
