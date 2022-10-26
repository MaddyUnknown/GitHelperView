import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';  
import { Route, Router } from '@angular/router';

@Component({
  selector: 'login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.css']
})
export class LoginComponentComponent implements OnInit {

  constructor(private authService: AuthenticationService, private toastr: ToastrService, private router: Router) {}

  ngOnInit(): void {
  }

  login(json: any): void {
    console.log(json);
    this.authService.authenticate(json.username, json.gitToken).subscribe({
      next:(data: {status: string,message: string})=>{
        if(data.status === "Success" ){
          this.toastr.success(data.message, data.status);
          this.router.navigateByUrl('/home');
        }
        else{
          this.toastr.error(data.message, data.status);
        }
      },
      error: (error)=>{
        this.toastr.error("Error Occured", "Error");
      }
    })
  }

}
