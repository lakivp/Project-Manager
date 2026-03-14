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
export class AuthService {
  private readonly TOKEN_KEY = 'jwt';

  constructor(
    private router: Router,
    private http: HttpClient,
    private jwtHelperService: JwtHelperService
  ) { }

  baseUrl = `${environment.apiUrl}/Korisnik`;
  logUrl = `${environment.apiUrl}/Auth`;
  loginUrl = `${this.logUrl}/login`;
  registerUrl = `${this.baseUrl}/Add`;

  register(ime: string, prezime: string, username: string, email: string, password: string, idUlogeAplikacija: number, status: number): Observable<string> {
    let payload = {
      ime: ime,
      prezime: prezime,
      username: username,
      email: email,
      password: password,
      idUlogeAplikacija: idUlogeAplikacija,
      status: status,
    };

    return this.http.post(this.registerUrl, payload, { responseType: 'text' });
  }

  login(username: string, password: string): Observable<string> {
    let payload = {
      ime: '',
      prezime: '',
      username: username,
      email: '',
      password: password,
      idUlogaAplikacije: 1,
      status: 1,
      phoneNumber: '',
      specijalizacija: null,
      opis: ''
    };

    return this.http.post(this.loginUrl, payload, { responseType: 'text' });
  }

  saveJwt(jwt: string): void {
    sessionStorage.setItem(this.TOKEN_KEY, jwt);
  }

  getJwt(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    let jwt = this.getJwt();

    if (jwt == null) return false;

    if (this.jwtHelperService.isTokenExpired(jwt)) return false;

    return true;
  }

  logout(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem('lang');
    this.router.navigateByUrl('/login');
    location.reload();
  }

  isLoginPage(): boolean {
    return window.location.href.includes('/login');
  }

  isResetPage(): boolean {
    return  window.location.href.startsWith('/resetPassword');
  }

  isAdminPage(): boolean {
    return  window.location.href.startsWith('/accessibility');
  }

  isRegisterPage(): boolean {
    return this.router.url === '/register';
  }

  getUserInfo(): any | null {
    const jwt = this.getJwt();
    let data = null;
    if (jwt) {
      data = jwtDecode(jwt);
    }
    return data;
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(this.baseUrl + "/Get" + id);
  }
}
