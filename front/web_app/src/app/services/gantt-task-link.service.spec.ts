import { TestBed } from '@angular/core/testing';

import { GanttTaskLinkService } from './gantt-task-link.service';

describe('GanttTaskLinkService', () => {
  let service: GanttTaskLinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GanttTaskLinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
