import { TestBed } from '@angular/core/testing';

import { SettingsServService } from './settings-serv.service';

describe('SettingsServService', () => {
  let service: SettingsServService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingsServService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
