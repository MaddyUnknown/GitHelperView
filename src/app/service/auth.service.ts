import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";


@Injectable()
export class AuthenticationService{

    private _authenticatedUser: string = "";

    getAuthUserName(): string {
        return this._authenticatedUser;
    }

    constructor(private http: HttpClient){ }

    isAuthenticated(): Observable<{status: string,message: string}>{
        return this.http.get<{status: string,message: string}>('/api/Login/IsAuthenticated');
    }

    authenticate(username:string, token:string): Observable<{status: string,message: string}>{
        return this.http.post<{status: string,message: string}>('/api/Login/AuthenticateUser', {username : username, token : token}).pipe(
            map((response: {status: string,message: string})=>{
                this._authenticatedUser = username;
                return response;
            })
        );
    }

    logout(): Observable<{status: string,message: string}> {
        return this.http.get<{status: string,message: string}>('/api/Login/Logout').pipe(
            map((response: {status: string, message: string})=>{
                this._authenticatedUser = "";
                return response;
            })
        );
    }
}