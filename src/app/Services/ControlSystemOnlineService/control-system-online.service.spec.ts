import { TestBed } from '@angular/core/testing';

import { ControlSystemOnlineService } from './control-system-online.service';

describe('ControlSystemOnlineService', () => {
  let service: ControlSystemOnlineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlSystemOnlineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
