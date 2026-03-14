import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { Auth1Service } from '../services/auth1.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileGuard implements CanActivate {
  constructor(
    private authService: Auth1Service,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const idParam = route.paramMap.get('id');
    const edit = route.paramMap.get('edit');

    if (idParam === null) {
      this.router.navigate(['/']);
      return of(false);
    }

    const profileID = +idParam; 
    const userId = this.authService.getIdFromToken();
    const isAdmin = this.authService.getRoleAdminFromToken();

    if (userId === null) {
      this.router.navigate(['/']); 
      return of(false);
    }

    if (Number(userId) !== profileID && !isAdmin && Number(edit)===1) {
      this.router.navigate(['/']);
      return of(false);
    } else {
      return of(true);
    }
  }
}
