import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/auth';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../environments/evnironment';

@Injectable({
  providedIn: 'root'
})
export class CreateProjectService {

  jwtHelper: any;

  constructor(
    private router: Router,
    private http: HttpClient,

  ) { }

  baseUrl = `${environment.apiUrl}/Projekat`;
  projectAddUrl = `${this.baseUrl}/Add`;
  projectUserUrl = `${this.baseUrl}/AddProjectMember`;

  add(ime: string,opis: string ,prioritet: string, pocetak: string, kraj: string): Observable<string> {
    let payload = {
      id: 0,
      naziv: ime,
      opis: opis,
      prioritet: prioritet,
      pocetak: pocetak,
      kraj: kraj,
      status: 1,
    };

    return this.http.post(this.projectAddUrl, payload, { responseType: 'text' });
  }
  addInMembers(korisnikId: number, proje: number): Observable<any> {
    let payload = {
      korisnikId: korisnikId,
      projekatId: proje,
      ulogaId: 1,
    };

    return this.http.post(this.projectUserUrl, payload, { responseType: 'text' });
  }


  
}
