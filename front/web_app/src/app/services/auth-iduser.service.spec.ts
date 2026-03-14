import { TestBed } from '@angular/core/testing';

import { AuthIduserService } from './auth-iduser.service';

describe('AuthIduserService', () => {
  let service: AuthIduserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthIduserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
