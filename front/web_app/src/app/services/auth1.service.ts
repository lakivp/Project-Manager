import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class Auth1Service {
  constructor(private jwtHelper: JwtHelperService) {}

  getUsernameFromToken(): string | null {
    const token = sessionStorage.getItem('jwt');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      const name =
        decodedToken[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
        ];
      return name || null;
    } else return null;
  }

  getIdFromToken():string | null{
    const token = sessionStorage.getItem('jwt');
    if(token)
    {
      const decodedToken = this.jwtHelper.decodeToken(token);
      const id = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      return id || null;
    }
    else 
      return null;
  }

  getRoleAdminFromToken():boolean {
    const token = sessionStorage.getItem('jwt');
  
    if (token) {
      const tokenPayload = token.split('.')[1];
      const decodedToken = JSON.parse(atob(tokenPayload));
      
      const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      
      if(role==="admin")
        return true;
      else
        return false;
    } 

    return false;
  }

  getRoleUserFromToken(): boolean {
    const token = sessionStorage.getItem('jwt');

    if (token) {
      const tokenPayload = token.split('.')[1];
      const decodedToken = JSON.parse(atob(tokenPayload));

      const role =
        decodedToken[
          'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        ];

      if (role === 'user') return true;
      else return false;
    }

    return false;
  }

  getRoleProjectManagerFromToken(): boolean {
    const token = sessionStorage.getItem('jwt');

    if (token) {
      const tokenPayload = token.split('.')[1];
      const decodedToken = JSON.parse(atob(tokenPayload));

      const role =
        decodedToken[
          'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        ];

      if (role === 'projectManager') return true;
      else return false;
    }

    return false;
  }

  getRoleGuestFromToken(): boolean {
    const token = sessionStorage.getItem('jwt');

    if (token) {
      const tokenPayload = token.split('.')[1];
      const decodedToken = JSON.parse(atob(tokenPayload));

      const role =
        decodedToken[
          'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        ];

      if (role === 'guest') return true;
      else return false;
    }

    return false;
  }
}
