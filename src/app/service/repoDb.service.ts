import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, delay, map, Observable, of, throwError } from "rxjs";
import { ToastrService } from 'ngx-toastr'; 
import { environment } from "src/environments/environment";

@Injectable()
export class RepoDbService{

    baseUrl : string = "";

    constructor(private http: HttpClient, private router: Router, private toastr: ToastrService){ 
        this.baseUrl = environment.webApiBaseUrl;
    }

    removeFavourite(userId: number, repoId: number): Observable<{status: string, message: string}>{
        let params = new HttpParams().set("userId", userId).set("repoId", repoId);
        return this.http.get<{status: string, message: string}>(this.baseUrl + '/api/Favourite/RemoveFavourite', {params: params}).pipe(
            catchError( error => {
                return this.handelError(error); // From 'rxjs'
            }));
    }

    setFavourite(userId: number, repoId: number): Observable<{status: string, message: string}>{
        let params = new HttpParams().set("userId", userId).set("repoId", repoId);
        return this.http.get<{status: string, message: string}>(this.baseUrl + '/api/Favourite/SetFavourite', {params: params}).pipe(
            catchError( error => {
                return this.handelError(error); // From 'rxjs'
            }));
    }


    private handelError(error: HttpErrorResponse){
        let customError:any;
        if(error.status == 401){
            this.router.navigateByUrl('/login');
            this.toastr.error("Your are not authorised to access this page. Please Log In", "Error");
            customError = "suppressed";
        }else{
            customError = error;
        }

        return throwError(customError);
    }


    

}