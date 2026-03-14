import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProfileService } from './profile.service';
import { environment } from '../environments/evnironment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AllTasksTableService {

  constructor(private http: HttpClient, 
    private profileService: ProfileService) { }
    private apiUrl = environment.apiUrl + '/Task/UserTasks';
    private baseUrl=environment.apiUrl+'/Task';
    
    getAllTasks(filter: any, userId: number): Observable<any[]> {
      const url = `${this.baseUrl}/GetToDoList${userId}`;
      return this.http.post<any[]>(url, filter, { params: { user_id: userId.toString() } });
    }

  filterTasks(filter: any, userId: number): Observable<any> {
      const url = `${this.baseUrl}/GetToDoList${userId}`;
      return this.http.post<any[]>(url, filter, { params: { user_id: userId.toString() } });
  }
    

}
