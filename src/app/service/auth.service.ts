import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";


@Injectable()
export class AuthenticationService{
    constructor(private http: HttpClient){ }

    isAuthenticated(): Observable<{status: string,message: string}>{
        return this.http.get<{status: string,message: string}>('/api/Login/IsAuthenticated');
    }

    authenticate(username:string, token:string): Observable<{status: string,message: string}>{
        return this.http.post<{status: string,message: string}>('/api/Login/AuthenticateUser', {username : username, token : token});
    }

    logout(): Observable<{status: string,message: string}> {
        return this.http.get<{status: string,message: string}>('/api/Login/Logout');
    }
}