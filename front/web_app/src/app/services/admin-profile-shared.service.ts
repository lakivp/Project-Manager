import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private profileChangeSubject = new Subject<any>();

  profileChange$ = this.profileChangeSubject.asObservable();

  notifyProfileChange(data: any) {
    this.profileChangeSubject.next(data);
  }
}
