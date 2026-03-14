import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/evnironment';
import { map } from 'rxjs/operators';
import { ProfileService } from './profile.service';
@Injectable({
  providedIn: 'root'
})
export class ProjectTableService {

  private apiUrl = environment.apiUrl + '/Projekat/UserProjects';
  private baseUrl = environment.apiUrl + '/Projekat';
  constructor(private http: HttpClient, private profileService: ProfileService) { }

  getProjects(userId: number): Observable<any[]> {
    const url = `${this.apiUrl}${userId}`;
    console.log(url);
    return this.http.get<any[]>(url);
  }

  deleteProjectLink(projectId: number): Observable<any> {
    const url = `${this.baseUrl}/Delete${projectId}`; 
    return this.http.delete(url);
  }

  filtriranjeProjekata(filterParams: any): Observable<any[]> {
    const url = `${this.baseUrl}/GetDashboardTable`;
    return this.http.post<any[]>(url, filterParams);
  }
}
