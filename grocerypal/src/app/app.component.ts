import { Component } from '@angular/core';
import { NavigationStart, Event, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { User } from './classes';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    
    title = 'Hello World';
    
    // Logged-in user's token; null if not logged in
    //
    loggedInUser: User | null = null;
    
    logoSrc = '../assets/images/grocery-pal-logo-happy.png';

    constructor(
        private auth: AuthService, 
        private router: Router) { }

    ngOnInit(): void {
        // Runs whenever the user routes to a page
        //
        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationStart) {
                
                // Retrieve the user's token 
                // (will be null if not logged in)
                //
                this.loggedInUser = this.auth.readToken();
                
                // Random chance for the logo apple to be evil
                // 
                this.randomLogoChange();
            }
        });
    }

    // Random chance for the logo apple to be evil
    //
    randomLogoChange() {
        if (Math.random() < 0.1) {
            this.logoSrc = '../assets/images/grocery-pal-logo-evil.png';
        } else {
            this.logoSrc = '../assets/images/grocery-pal-logo-happy.png'
        }
    }

    logout() {
        
        // Clear the token
        //
        this.auth.clearToken();

        // Redirect to the login page
        //
        this.router.navigate(['/login']);
    }
}
