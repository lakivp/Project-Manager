import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/evnironment';


@Injectable({
  providedIn: 'root'
})
export class AuthIduserService {
  userId:string | null = null;
  constructor(private jwtHelper:JwtHelperService, private http: HttpClient) { }


  getUserId():string | null{
    if(this.userId) return this.userId;
    const token = sessionStorage.getItem('jwt');
    if(token)
    {
      const decodedToken = this.jwtHelper.decodeToken(token);
      const name = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      this.userId=name;
      return name || null;
    }
    else 
      return null;
  }
  



  getProjects(): Observable<any[]> {

    let apiUrl = environment.apiUrl + '/Projekat/UserProjects'+this.getUserId();
    return this.http.get<any[]>(apiUrl);
  }
  getAllTasks(){
    let apiUrl = environment.apiUrl + '/Task/UserTasks'+this.getUserId();
    return this.http.get<any[]>(apiUrl);
  }
  getProjectsById(id:string): Observable<any[]> {
    let apiUrl = environment.apiUrl + '/Projekat/UserProjects'+id
    return this.http.get<any[]>(apiUrl);
  }
  
}
