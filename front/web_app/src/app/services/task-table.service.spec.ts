import { TestBed } from '@angular/core/testing';

import { TaskTableService } from './task-table.service';

describe('TaskTableService', () => {
  let service: TaskTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
