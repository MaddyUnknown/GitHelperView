import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "src/environments/environment";


@Injectable()
export class AuthenticationService{

    baseUrl : string = "";

    getAuthUserName(): string {
        let username: string| null = localStorage.getItem('userName');
        if(username === null){
            return "";
        }
        else{
            return username;
        }
    }

    constructor(private http: HttpClient){ 
        this.baseUrl = environment.webApiBaseUrl;
    }

    isAuthenticated(): Observable<{status: string,message: string}>{
        return this.http.get<{status: string,message: string}>(this.baseUrl + '/api/Login/IsAuthenticated');
    }

    authenticate(username:string, token:string): Observable<{status: string,message: string}>{
        return this.http.post<{status: string,message: string}>(this.baseUrl + '/api/Login/AuthenticateUser', {username : username, token : token}).pipe(
            map((response: {status: string,message: string})=>{
                localStorage.setItem('userName', username);
                return response;
            })
        );
    }

    logout(): Observable<{status: string,message: string}> {
        return this.http.get<{status: string,message: string}>(this.baseUrl + '/api/Login/Logout').pipe(
            map((response: {status: string, message: string})=>{
                localStorage.removeItem('userName');
                return response;
            })
        );
    }
}