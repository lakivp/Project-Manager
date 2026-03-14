import { TestBed } from '@angular/core/testing';

import { AddProjectMemberService } from './add-project-member.service';

describe('AddProjectMemberService', () => {
  let service: AddProjectMemberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddProjectMemberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
