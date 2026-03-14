import { TestBed } from '@angular/core/testing';

import { GetTaskService } from './get-task.service';

describe('GetTaskService', () => {
  let service: GetTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
