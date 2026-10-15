import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../classes';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  private authSub: any;
  user = new User();
  // route: any;
  

  constructor(
    private auth: AuthService, 
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    let userid: string = this.route.snapshot.params['id'];
    this.authSub = this.auth.getUserById(userid).subscribe(
      response => {
          //if successful
          this.user = response;
      }, error => {
          console.log("error:", error.error);
      }
  );
  }

}
