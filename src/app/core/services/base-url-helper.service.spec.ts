import { TestBed } from '@angular/core/testing';

import { BaseUrlHelperService } from './base-url-helper.service';

describe('BaseUrlHelperService', () => {
  let service: BaseUrlHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaseUrlHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
