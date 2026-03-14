import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/auth';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../environments/evnironment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { jwtDecode } from 'jwt-decode';
import { Notification } from '../interfaces/notification';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    jwtHelper: any;
    constructor(private http: HttpClient) { }

    baseUrl = `${environment.apiUrl}/Obavestenje`;

    getNotifications(id:string): Observable<Notification[]> {
        return this.http.get<Notification[]>(this.baseUrl + "/GetObavestenjaByKorisnikId"+id, {
            responseType: 'json',
        });
    }
    markNotificationRead(id: Number): Observable<any> {
        return this.http.put(this.baseUrl + "/MarkAsRead?id=" + id, {
            responseType: 'json',
        });
    }
    deleteNotification(id: Number): Observable<any> {
        console.log(this.baseUrl + "/Delete?id=" + id);
        return this.http.delete(this.baseUrl + "/Delete?id=" + id, {
            responseType: 'json',
        });
    }
}
