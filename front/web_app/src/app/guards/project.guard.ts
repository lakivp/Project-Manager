import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Auth1Service } from '../services/auth1.service';
import { ProfileService } from '../services/profile.service';
import { Observable,of} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ProjectGuard implements CanActivate {
  constructor(
    private authService: Auth1Service,
    private profileService: ProfileService,
    private router: Router,
    private route: ActivatedRoute 
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const projectID = route.paramMap.get('id');

    if (projectID === null) {
      this.router.navigate(['/']);
      return of(false);
    }
    
    const userId = this.authService.getIdFromToken(); 

    if (userId === null) {
      this.router.navigate(['/']); 
      return of(false);
    }

    return this.profileService.getUserProjects(+userId).pipe( 
      map(projects => {
        if (projects && projects.some(project => Number(project.id) === Number(projectID))) {
          return true; 
        } else {
          this.router.navigate(['/']); 
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate(['/']);
        return of(false);
      })
    );
  }
}
