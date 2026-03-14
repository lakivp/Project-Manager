import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService1 {
  private login = new Subject<any>();

  profileChange$ = this.login.asObservable();

  notifyLogin(data:any) {
    console.log("USSASOO");
    this.login.next(data);
  }
}
