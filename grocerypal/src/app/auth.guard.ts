import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, 
  CanActivate, 
  Router, 
  RouterStateSnapshot, 
  UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService, 
    private router: Router) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

    if (this.authService.isAuthenticated()) {
      const userRole = this.authService.getLoggedInUserRole();
      
      // If the user role equals the required role for the route
      // 
      if (route.data['requiredRoles'] && 
          route.data['requiredRoles'].includes(userRole)) {
            
        return true;
      
      }

      // User not the correct role
      //
      this.router.navigate(['/home']);
      
      return false;
    }

    // User not logged in
    //
    this.router.navigate(['/home']);
    return false;
  }

}