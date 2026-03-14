import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private memberChange = new Subject<any>();
  private addedUsers = new Subject<any>();

  memberChange$ = this.memberChange.asObservable();
  addedUsers$ = this.addedUsers.asObservable();

  notifyMemberChange(data: any) {
    this.memberChange.next(data);
  }
  notifyAddUsers(data: any) {
    this.addedUsers.next(data);
  }
}
