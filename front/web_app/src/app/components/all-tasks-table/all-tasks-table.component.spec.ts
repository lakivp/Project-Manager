import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTasksTableComponent } from './all-tasks-table.component';

describe('AllTasksTableComponent', () => {
  let component: AllTasksTableComponent;
  let fixture: ComponentFixture<AllTasksTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllTasksTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllTasksTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
