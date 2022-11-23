import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { catchError, firstValueFrom, map, Observable, of } from "rxjs";
import { environment } from "src/environments/environment";
import { BaseHttpService } from "./base.http.service";

export interface IUser {
    userId: number;
    userName: string;
    userAvatarUrl: string;
}

export const DEFAULT_USER_DETAILS : IUser = {userId: -1, userName: "", userAvatarUrl: ""};

@Injectable()
export class AuthenticationService extends BaseHttpService{

    baseUrl : string = "";

    private userDetails: IUser | undefined;

    getAuthUserInfo(): Observable<IUser> {
        if(this.userDetails !== undefined && this.userDetails !== DEFAULT_USER_DETAILS) {
            return of(this.userDetails);
        }
        else {
            return this.http.get<IUser>(this.baseUrl+ "/api/Login/GetUser")
        }
    }

    constructor(private http: HttpClient, router: Router, toastr: ToastrService){ 
        super(router, toastr);
        this.baseUrl = environment.webApiBaseUrl;
    }

    isAuthenticated(): Observable<{status: string,message: string}>{
        return this.http.get<{status: string,message: string}>(this.baseUrl + '/api/Login/IsAuthenticated');
    }

    authenticate(username:string, token:string): Observable<{status: string,message: string}>{
        return this.http.post<{status: string,message: string}>(this.baseUrl + '/api/Login/AuthenticateUser', {username : username, token : token}).pipe(
            map((response: {status: string,message: string})=>{
                return response;
            })
        );
    }

    logout(): Observable<{status: string,message: string}> {
        return this.http.get<{status: string,message: string}>(this.baseUrl + '/api/Login/Logout').pipe(
            catchError( error => {
                return this.handelError(error); // From 'rxjs'
            })
        );
    }
}