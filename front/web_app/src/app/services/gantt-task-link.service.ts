import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GanttTaskLink } from '../interfaces/ganttTaskLink.model';
import { environment } from '../environments/evnironment';

@Injectable({
  providedIn: 'root'
})
export class GanttTaskLinkService {

  private baseUrl = `${environment.apiUrl}/ZavisnostTask`;//ovo treba na beku da se doda

  constructor(private http:HttpClient) { }

  getAllLinks(): Promise<GanttTaskLink[]> {
    return new Promise((resolve, reject) => {
      this.http.get<any[]>(`${this.baseUrl}/GetAll`).subscribe(
        (data: any[]) => {
          const tasks = data.map(item => ({
            id: item.id,
            source: item.sourceId,
            target: item.targetId,
            type:item.type
          }));
          resolve(tasks);
        },
        error => {
          reject(error);
        }
      );
    });
  }


  addTaskLink(ganttTaskLink:GanttTaskLink): Observable<GanttTaskLink> {
    const dataToSend = {
      sourceId: ganttTaskLink.source,
      targetId: ganttTaskLink.target,
      type: ganttTaskLink.type
    };

    return this.http.post<GanttTaskLink>(`${this.baseUrl}/Add`,dataToSend)
  }

  updateTaskLink(updateLinkId:number, updatedLink: GanttTaskLink): Observable<GanttTaskLink> {
    const url = `${this.baseUrl}/UpdateLink/${updateLinkId}`;
    return this.http.put<GanttTaskLink>(url, updatedLink);
  }

  
  deleteTaskLink(linkId: number): Observable<any> {
    const url = `${this.baseUrl}/Delete${linkId}`; 
    return this.http.delete(url);
  }


}

