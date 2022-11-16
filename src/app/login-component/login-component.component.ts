import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';  
import { Route, Router } from '@angular/router';
import { ThemeService } from '../service/theme.service';

declare var $: any;

@Component({
  selector: 'login-component',
  templateUrl: './login-component-v2.component.html',
  styleUrls: ['./login-component-v2.component.css']
})
export class LoginComponentComponent implements OnInit {

  constructor(private authService: AuthenticationService, private toastr: ToastrService, private router: Router) {}

  ngOnInit(): void {

    //Init Bootstrap tooltips
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })
  }

  login(json: any): void {
    this.authService.authenticate(json.username, json.gitToken).subscribe({
      next:(data: {status: string,message: string})=>{
        if(data.status === "Success" ){
          // this.toastr.success(data.message, data.status);
          this.router.navigateByUrl('/home');
        }
        else{
          if(data.message == "Bad Credentials")
            this.toastr.error("Invalid username/password", data.status);
          else
            this.toastr.error(data.message, data.status);
        }
      },
      error: (error)=>{
        this.toastr.error("Error occured", "Error");
      }
    })
  }

}
