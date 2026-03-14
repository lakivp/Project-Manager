import { Injectable } from '@angular/core';
import { environment } from '../environments/evnironment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AddProjectMemberService {
  private baseUrl = `${environment.apiUrl}/Projekat/AddProjectMember`;
  private deleteMember = `${environment.apiUrl}/Projekat/RemoveProjectMember`;
  private korisniciUrl = `${environment.apiUrl}/Korisnik/GetAll`;
  private projektiUrl = `${environment.apiUrl}/Projekat/GetAll`;
  private projkatUrl = `${environment.apiUrl}/Projekat/Get`;
  private korisniciNaProjektuUrl = `${environment.apiUrl}/Projekat/UsersOnProject`;

  constructor(private http: HttpClient) {}

  addProjectMembers(
    korisnikId: number,
    projekatId: number,
    ulogaId: number
  ): Observable<any> {
    let payload = {
      korisnikId: korisnikId,
      projekatId: projekatId,
      ulogaId: ulogaId,
    };

    return this.http.post<any>(this.baseUrl, payload);
  }
  removeProjectMember(project_id: number, user_id: number): Observable<any> {
    return this.http.post(
      `${this.deleteMember}?project_id=${project_id}&user_id=${user_id}`,
      {}
    );
  }
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.korisniciUrl);
  }

  getAllProjects(): Observable<any[]> {
    return this.http.get<any[]>(this.projektiUrl);
  }

  getProject(projectId: number): Observable<any> {
    return this.http.get<any>(`${this.projkatUrl}${projectId}`);
  }

  getAllUsersOnProject(projectId: number): Observable<any[]> {
    console.log("ID",projectId);
    return this.http.get<any>(`${this.korisniciNaProjektuUrl}${projectId}`);
  }
}
