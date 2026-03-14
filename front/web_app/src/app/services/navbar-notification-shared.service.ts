import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService2 {
  private notification = new Subject<any>();

  newNotification$ = this.notification.asObservable();

  getNotifications(data:any) {
    console.log("USSASOOsdf");
    this.notification.next(data);
  }
}
