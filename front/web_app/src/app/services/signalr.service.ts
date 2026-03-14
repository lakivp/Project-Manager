import { EventEmitter, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { Notification } from '../interfaces/notification';
import { environment } from '../environments/evnironment';
import { Observable, from, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection | undefined;
  public notificationReceived = new EventEmitter<string>();
  constructor(private toastr: ToastrService) {
  }
  private createHubConnection(token: string) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.notifHubUrl}?token=${this.getToken()}`, {
        accessTokenFactory: () => token,
        withCredentials: true
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('ReceiveNotification', (message: string) => {
      this.notificationReceived.emit(message);
    });
  }
  private getToken(): string {
    console.log(sessionStorage.getItem('jwt'));
    return sessionStorage.getItem('jwt') || '';
  }

  // public checkConnection():any{
  //   return this.hubConnection.connectionId;
  // }

  public closeConnection(): Observable<any> {
    if (this.hubConnection) {
      return from(this.hubConnection.stop().then(() => {
        this.hubConnection = undefined; // Očistite referencu nakon zatvaranja
      }));
    } else {
      return of(null); 
    }
  }

  public checkConnection(): boolean {
    return this.hubConnection != null && this.hubConnection.state === signalR.HubConnectionState.Connected;
  }
 

  public startConnection(): void {
    const token = sessionStorage.getItem('jwt');
    const flag = !this.hubConnection;
    if (token && flag) {
      this.createHubConnection(token);
      if(this.hubConnection){
        this.hubConnection.start()
          .then(() => console.log('SignalR Connection Started'))
          .catch(err => console.log('Error while starting SignalR connection: ' + err));
      }
    } else {
      console.error('No token found in localStorage.');
    }
  }

  public addNotificationListener = () => {
    if(this.hubConnection){
    this.hubConnection.on('ReceiveNotification', (message: string) => {
      this.notificationReceived.emit(message);
    });}
  }
}
