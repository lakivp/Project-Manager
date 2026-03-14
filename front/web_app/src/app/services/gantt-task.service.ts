import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GanttTask } from '../interfaces/ganttTask.model';
import { environment } from '../environments/evnironment';
import { differenceInDays } from 'date-fns';
import { addDays } from 'date-fns';
import { gantt } from 'dhtmlx-gantt';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class GanttTaskService {

  constructor(private http:HttpClient,private jwtHelper:JwtHelperService) { }
  private baseUrl = `${environment.apiUrl}/Task`;
  private userPrApi = `${environment.apiUrl}/Projekat/UsersOnProject`;
  
  getTasksByProjectId(projectId: number): Promise<GanttTask[]> {
    return new Promise((resolve, reject) => {
      this.http.get<any[]>(`${this.baseUrl}/ProjectTasks${projectId}`).subscribe(
        (data: any[]) => {
          const tasks = data.map(item => ({
            id: item.id,
            text: item.naziv,
            start_date: this.adjustForTimezone((new Date(this.parseDate(item.pocetak)))),
            parent: item.idParent,
            priority: item.prioritet,
            progress: 0,
            duration: differenceInDays(new Date(this.parseDate(item.kraj)), new Date(this.parseDate(item.pocetak))),
            opis: item.opis,
            idProjekat: item.idProjekat,
            idLabel: item.idLabel,
            kraj: new Date(this.parseDate(item.kraj))
          }));
          resolve(tasks);
        },
        error => {
          reject(error);
        }
      );
    });
  }

  parseDate(dateString: string): string {
    const [day, month, year] = dateString.split('.');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }


  parseDate1(dateString: string): string {
    const [year, month, day] = dateString.split('-');
    const formattedDate = `${day}.${month}.${year}`;
    return formattedDate;
  }

  adjustForTimezone(date:Date):Date{
    var timeOffsetInMS:number = date.getTimezoneOffset() * 60000;
    date.setTime(date.getTime() + timeOffsetInMS);
    return date
}
  
  updateTask(ganttTask:GanttTask): Observable<GanttTask> {
    const dataToSend = {
      id: ganttTask.id, 
      naziv: ganttTask.text,
      opis: ganttTask.opis,
      prioritet: ganttTask.priority,
      pocetak: this.parseDate1(ganttTask.start_date.toISOString().slice(0, 10)),
      kraj: this.parseDate1((addDays(ganttTask.start_date, ganttTask.duration)).toISOString().slice(0, 10)),
      idParent: ganttTask.parent,
      idProjekat: ganttTask.idProjekat,
      idLabel: ganttTask.idLabel,
      status: 1
    };

    return this.http.put<GanttTask>(`${this.baseUrl}/Update`,dataToSend)
  }

  getTaskById(taskId: number): Promise<GanttTask> {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.baseUrl}/Get${taskId}`).toPromise()
        .then((data: any) => {
          const task: GanttTask = {
            id: data.id,
            text: data.naziv,
            start_date: new Date(data.pocetak),
            parent: data.idParent,
            priority: data.prioritet,
            progress: 0.5,
            duration: differenceInDays(new Date(data.kraj), new Date(data.pocetak)),
            opis: data.opis,
            idProjekat: data.idProjekat,
            idLabel: data.idLabel,
            kraj: new Date(data.kraj)
          };
          resolve(task);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  deleteTaskById(taskId: number): Observable<any> {
    const deleteUrl = `${this.baseUrl}/Delete${taskId}`;
    return this.http.delete(deleteUrl);
}

  getProjectMember(projectId:number): Observable<any> {
    return this.http.get<any[]>(`${this.userPrApi}${projectId}`);
  }

  getUsername():string | null{
    const token = sessionStorage.getItem('jwt');
    if(token)
    {
      const decodedToken = this.jwtHelper.decodeToken(token);
      const name = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
      return name || null;
    }
    else 
      return null;
  }

}
