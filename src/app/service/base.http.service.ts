import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { throwError } from "rxjs";

export abstract class BaseHttpService {

    constructor(private router: Router, private toastr: ToastrService) {}

    protected handelError(error: HttpErrorResponse){
        let customError:any;
        if(error.status == 401){
            this.router.navigateByUrl('/login');
            this.toastr.error("Your are not authorised to access this service. Please Log In", "Error");
            customError = "suppressed";
        }else{
            customError = error;
        }

        return throwError(customError);
    }
}