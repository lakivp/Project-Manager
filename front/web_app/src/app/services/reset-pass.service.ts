import { Injectable } from '@angular/core';
import { environment } from '../environments/evnironment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResetPassService {

  private baseUrl = `${environment.apiUrl}/Korisnik`;

  constructor(private http: HttpClient) { }

  resetPass(resetToken: string, newPassword: string, confirmNewPassword: string):Observable<string>{
    return this.http.post<string>(`${this.baseUrl}/ResetPassword?resetToken=${resetToken}&newPassword=${newPassword}&confirmNewPassword=${confirmNewPassword}`,{});
  }
  
}
