import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService3 {
  private newProject = new Subject<any>();

  project$ = this.newProject.asObservable();

  notifyNewProject(data:any) {
    console.log("USSASOOsdf");
    this.newProject.next(data);
  }
}
