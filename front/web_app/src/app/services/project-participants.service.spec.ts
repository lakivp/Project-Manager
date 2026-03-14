import { TestBed } from '@angular/core/testing';

import { ProjectParticipantsService } from './project-participants.service';

describe('ProjectParticipantsService', () => {
  let service: ProjectParticipantsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectParticipantsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
