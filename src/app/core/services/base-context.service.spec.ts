import { TestBed } from '@angular/core/testing';

import { BaseContextService } from './base-context.service';

describe('BaseContextService', () => {
  let service: BaseContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaseContextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
