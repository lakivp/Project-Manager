import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { projectManGuard } from './project-man.guard';

describe('projectManGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => projectManGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
