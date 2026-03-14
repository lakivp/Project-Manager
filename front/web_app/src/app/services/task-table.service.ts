import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/evnironment';
import { Observable } from 'rxjs';
import { ProjectTableService } from './project-table.service';

@Injectable({
  providedIn: 'root'
})
export class TaskTableService {

  private apiUrl = environment.apiUrl + '/Task/ProjectTasks';
  private baseUrl=environment.apiUrl+'/Task'
  constructor(
    private http: HttpClient,
    private projectService: ProjectTableService
  ) { }

  getTasks(projectId:number): Observable<any[]> {
    //const url = `${this.apiUrl}${projectId}`; // Dodajemo ID projekta na kraj URL-a
    return this.http.get<any[]>(`${this.apiUrl}${projectId}`);
  }

  deliteTask(taskId: number): Observable<any> {
    const url = `${this.baseUrl}/Delete${taskId}`; 
    return this.http.delete(url);
  }

  filterTasks(filter:any,projectId:number):Observable<any>
  {
    const url = `${this.baseUrl}/GetFilteredTasks${projectId}`;
    return this.http.post<any[]>(url, filter);
  }

  getAllTasks():Observable<any[]>{
    return this.http.get<any[]>(`${this.baseUrl}/GetAll`);

  }
}
