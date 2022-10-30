import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";


@Injectable()
export class AuthenticationService{


    getAuthUserName(): string {
        let username: string| null = localStorage.getItem('userName');
        if(username === null){
            return "";
        }
        else{
            return username;
        }
    }

    constructor(private http: HttpClient){ }

    isAuthenticated(): Observable<{status: string,message: string}>{
        return this.http.get<{status: string,message: string}>('/api/Login/IsAuthenticated');
    }

    authenticate(username:string, token:string): Observable<{status: string,message: string}>{
        return this.http.post<{status: string,message: string}>('/api/Login/AuthenticateUser', {username : username, token : token}).pipe(
            map((response: {status: string,message: string})=>{
                localStorage.setItem('userName', username);
                return response;
            })
        );
    }

    logout(): Observable<{status: string,message: string}> {
        return this.http.get<{status: string,message: string}>('/api/Login/Logout').pipe(
            map((response: {status: string, message: string})=>{
                localStorage.removeItem('userName');
                return response;
            })
        );
    }
}