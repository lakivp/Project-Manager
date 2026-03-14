import { TestBed } from '@angular/core/testing';

import { AllTasksTableService } from './all-tasks-table.service';

describe('AllTasksTableService', () => {
  let service: AllTasksTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllTasksTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
