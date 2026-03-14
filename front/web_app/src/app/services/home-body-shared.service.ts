import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private callHomeFunctionSource = new Subject<number>();
  callHomeFunction$ = this.callHomeFunctionSource.asObservable();

  callHomeFunction(id:number) {
    this.callHomeFunctionSource.next(id);
  }
}