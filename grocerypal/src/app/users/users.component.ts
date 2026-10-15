import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
// import { User } from '../classes';

export interface PeriodicElement {
  userfname: string;
  userlname: string;
  useremail: string;
  userrole: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  private authSub: any;
  counter = 0;

  users: PeriodicElement[] = [];
  displayedColumns: string[] = [
    'NO',
    'ID',
    'First Name', 
    'Last Name', 
    'Email', 
    'Role', 
    'Actions'];

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.authSub = this.auth.getAllUsers().subscribe(
      response => {
          //if successful
          this.users = response.users;
          // console.log(this.users);
      }, error => {
          console.log("error:", error.error);
      }
  );

  }

  deleteUserById(userid: number){
    // console.log(userid);
    this.authSub = this.auth.deleteUserById(userid).subscribe(
      response => {
          //if successful
          if(response.rowCount = 1) {
            this.ngOnInit();
          }
          
          // console.log(this.ELEMENT_DATA);
      }, error => {
          console.log("error:", error.error);
      }
  );
  }

}
