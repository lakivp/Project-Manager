import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Auth1Service } from '../services/auth1.service';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {

  constructor(
    private authService1: Auth1Service,
    private authService:AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.authService.isAuthenticated())
      {
        if(this.authService1.getRoleUserFromToken() || this.authService1.getRoleGuestFromToken() || this.authService1.getRoleProjectManagerFromToken())
        {
          return true;
        }
        else
        {
          if(this.authService1.getRoleAdminFromToken()){
            this.router.navigateByUrl('/accessibility');
          }
          else{
            this.router.navigateByUrl('/');
          }
          return false;
        }
      }
      else
      {
        this.router.navigateByUrl('/login');
        return false;
      }
  }
  
}