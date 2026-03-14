import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/evnironment';
import { map } from 'rxjs/operators';
import { ProfileService } from './profile.service';
@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiUrl = environment.apiUrl + '/Projekat/Update';
  private baseUrl = environment.apiUrl + '/Projekat';

  constructor(
    private http: HttpClient,
    private profileService: ProfileService
  ) {}

  updateProject(project: any) {
    console.log('server', project);
    return this.http.put(this.apiUrl, project, { responseType: 'json' });
  }

  getProjectById(id: number): Observable<any> {
    const url = `${this.baseUrl}/Get${id}`; // Formirajte URL za dobavljanje projekta po ID-u
    return this.http.get<any>(url);
  }

  
}
