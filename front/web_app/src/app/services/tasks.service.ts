import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/evnironment';
import { Label, Task } from '../../types';
import { param } from 'jquery';
@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private getAllTasks = environment.apiUrl + '/Task/GetAll';
  private getProjectTasks = environment.apiUrl + '/Task/ProjectTasks';
  private label = environment.apiUrl + '/Label/GetLabelById';
  private allLabels = environment.apiUrl + '/Label/GetLabels';
  private projectLabels = environment.apiUrl + '/Label/GetLabelsByProjectId';
  private addLabel = environment.apiUrl + '/Label/AddLabel';
  private updateLabel = environment.apiUrl + '/Label/Update';
  private deleteLabelUrl = environment.apiUrl + '/Label/Delete';
  private sortLabelsURL = environment.apiUrl + '/Label/UpdateLabelOrder';
  private updateTask = environment.apiUrl + '/Task/Update';

  constructor(private http: HttpClient) {}

  getTasks(route: string, id: number): Observable<any[]> {
    console.log('getTasks', this.getProjectTasks + id);
    if (route === 'projectView/:id') {
      const tasks = this.http.get<any[]>(this.getProjectTasks + id);
      return tasks;
    } else {
      return this.http.get<any[]>(this.getAllTasks);
    }
  }
  getLabelName(id: Number): Observable<any> {
    return this.http.get<any>(this.label + id);
  }
  getAllLabels(route: string, id: number) {
    if (route === 'projectView/:id') {
      return this.http.get<any[]>(this.projectLabels + id);
    }
    return this.http.get<any[]>(this.allLabels);
  }
  addTaskStage(label: Label) {
    return this.http.post<any>(this.addLabel, label);
  }
  transferTask(task: Task) {
    console.log(task);
    return this.http.put<any>(this.updateTask, task);
  }
  sortLabels(projectId: number, newOrder: string) {
    console.log(newOrder);
    console.log(
      this.sortLabelsURL + '?project_id=' + projectId + '&new_order=' + newOrder
    );
    return this.http.post<any>(
      this.sortLabelsURL +
        '?project_id=' +
        projectId +
        '&new_order=' +
        newOrder,
      {}
    );
  }

  changeLabelName(label:any): Observable<any>{
    return this.http.put<any>(this.updateLabel, label);
  }

  deleteLabel(label:any):Observable<any>{
    console.log(label);
    return this.http.delete<any>(this.deleteLabelUrl, {body:label});
  }
}
