import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTaskStageComponent } from './add-task-stage.component';

describe('AddTaskStageComponent', () => {
  let component: AddTaskStageComponent;
  let fixture: ComponentFixture<AddTaskStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddTaskStageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddTaskStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
