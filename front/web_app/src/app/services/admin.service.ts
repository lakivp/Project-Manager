import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/auth';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../environments/evnironment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(
    private http: HttpClient,
  ) { }

  baseUrl = `${environment.apiUrl}/Korisnik`;
  loginUrl = `${this.baseUrl}/login`;
  registerUrl = `${this.baseUrl}/Add`;
  adminUserActivation=`${environment.apiUrl}/Admin`;
  roleChange = `${environment.apiUrl}/Admin/ChangeUser`;
  addUser= `${environment.apiUrl}/Korisnik/Add`;
  deleteUserUrl= `${environment.apiUrl}/Korisnik/Delete`;

  getUsers():Observable<User[]>{
    return this.http.get<User[]>(this.baseUrl+"/GetAll");
  }
  changeUserRole(id:any, role:any):Observable<User> {
    return this.http.put<any>(this.roleChange + id+'/Role'+role, {
      responseType: 'json',
    });
  }
  activateUser(id:string):Observable<User>{
    return this.http.post<User>(this.adminUserActivation+"/ActivateUser"+id,{});
  }
  deactivateUser(id:string):Observable<User>{
    return this.http.post<User>(this.adminUserActivation+"/DeactivateUser"+id,{});
  }

  addNewUser(user:any):Observable<User>{
    return this.http.post<User>(this.addUser, user, {responseType:'json'});
  }

  deleteUser(userId:string):Observable<User>{
    return this.http.delete<User>(this.deleteUserUrl+userId);
  }
}
