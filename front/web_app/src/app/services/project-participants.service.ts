import { Injectable } from '@angular/core';
import { environment } from '../environments/evnironment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProjectParticipantsService {

  private apiUrl = environment.apiUrl + '/Projekat/UsersOnProject';
  constructor( private http: HttpClient) { }

  getData(projectId:number): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}${projectId}`);
  }
}
