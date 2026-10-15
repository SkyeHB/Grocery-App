import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { User, status } from '../classes';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    
    // Boolean for password being hidden or not
    //
    hide: boolean = true;
    
    loading: boolean = false;
    
    // User object synced with form fields
    //
    user: User = new User;
    
    errorMessage: string = "";
    
    isFormError: boolean = false;
    
    private authSub: any;

    constructor(
        private auth: AuthService, 
        private routing: Router) { }

    ngOnInit(): void {
    }

    // Upon the user clicking the login button
    //
    onSubmit(): void {
        
        this.isFormError = false;
        
        // Check for empty fields
        //
        const emailL: number = this.user.useremail.length;
        const passwL: number = this.user.userpassword.length;
        var valid: boolean = emailL > 0 && passwL > 0;

        if (!valid) {
            this.errorMessage = "Fill in all fields";
            this.isFormError = true;
            return;
        }
        
        // Check if the email has the correct format
        //
        var reg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

        if (!reg.test(this.user.useremail)) {
            this.errorMessage = "Invalid email";
            this.isFormError = true;
            return;
        }
        
        // Convert email to lowercase
        //
        this.user.useremail = this.user.useremail.toLowerCase();
       
        // Attempts to log in the user
        //
        this.authSub = this.auth.login(this.user).subscribe(
            response => {
                
                // If successful
                //
                if (response.status == status.OKAY && response.token) {
                    
                    // Save login token locally
                    //
                    this.auth.setToken(response.token);
                    
                    // Redirect to products page
                    //
                    if (response.user.userrole === "admin") {
                        this.routing.navigate(["/users"]);
                    } else {
                        this.routing.navigate(["/products"]);
                    }
                }

                // If the database connection failed
                //
                else if (response.status == status.DB_CONNECTION_FAIL) {
                    this.errorMessage = "Database connection failed";
                    this.isFormError = true;
                }
                
                // If incorrect credentials
                //
                else if (response.status == status.NOT_AUTHORIZED) {
                    const msg = "Incorrect credentials or User does not exist"
                    this.errorMessage = msg;
                    this.isFormError = true;
                }

                // Anything else
                //
                else {
                    this.errorMessage = "Unexpected issue. Try again later.";
                    this.isFormError = true;
                }
            }, error => {
                console.log("error:", error.error);
            }
        );
    }

    ngOnDestroy(): void {
        if (this.authSub) this.authSub.unsubscribe();
    }
}
