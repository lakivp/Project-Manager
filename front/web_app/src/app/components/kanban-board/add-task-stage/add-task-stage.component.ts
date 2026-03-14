import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TasksService } from '../../../services/tasks.service';
import { Label } from '../../../../types';

@Component({
  selector: 'app-add-task-stage',
  templateUrl: './add-task-stage.component.html',
  styleUrl: './add-task-stage.component.css'
})
export class AddTaskStageComponent {
  @Output("closeModal") closeModal:EventEmitter<any>=new EventEmitter<any>();
  @Output("addStage") addStage:EventEmitter<any>=new EventEmitter<any>();
  stage:string;

  constructor(private tasksService: TasksService) {}

  inputChange(event:any){
    this.stage=event.target.value;
  }

  addTaskStage(){
    this.addStage.emit(this.stage);
  }

  close(){
    this.closeModal.emit();
  }

}
