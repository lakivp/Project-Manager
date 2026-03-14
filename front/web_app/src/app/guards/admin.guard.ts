import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Auth1Service } from '../services/auth1.service';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

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
        if(this.authService1.getRoleAdminFromToken())
        {
          return true;
        }
        else
        {
          this.router.navigateByUrl('/');
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