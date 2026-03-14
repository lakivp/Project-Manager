import { Injectable } from '@angular/core';
import { environment } from '../environments/evnironment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private baseUrl = `${environment.apiUrl}/Email`;

  constructor(private http: HttpClient) { }

  forgotPassword(email: string){
    return this.http.post(`${this.baseUrl}/ForgotPassword?email=${email}`,{});
  }
}
