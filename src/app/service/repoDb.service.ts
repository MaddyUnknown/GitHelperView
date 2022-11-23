import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, delay, map, Observable, of, throwError } from "rxjs";
import { ToastrService } from 'ngx-toastr'; 
import { environment } from "src/environments/environment";
import { BaseHttpService } from "./base.http.service";

@Injectable()
export class RepoDbService extends BaseHttpService{

    baseUrl : string = "";

    constructor(private http: HttpClient, router: Router, toastr: ToastrService){ 
        super(router, toastr);
        this.baseUrl = environment.webApiBaseUrl;
    }

    removeFavourite(repoId: number): Observable<{status: string, message: string}>{
        return this.http.post<{status: string, message: string}>(this.baseUrl + '/api/RepoActivity/RemoveFavourite', repoId).pipe(
            catchError( error => {
                return this.handelError(error); // From 'rxjs'
            }));
    }

    setFavourite(repoId: number): Observable<{status: string, message: string}>{
        return this.http.post<{status: string, message: string}>(this.baseUrl + '/api/RepoActivity/SetFavourite', repoId).pipe(
            catchError( error => {
                return this.handelError(error); // From 'rxjs'
            }));
    }

    persistActivityCount(repoActivity: {repoId: number, count: number}[]): Observable<{status: string, message: string}>{
        return this.http.post<{status: string, message: string}>(this.baseUrl + '/api/RepoActivity/UpdateRepoCount', repoActivity).pipe(
            catchError( error => {
                return this.handelError(error); // From 'rxjs'
            }));
    }
    

}