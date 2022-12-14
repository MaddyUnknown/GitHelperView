import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, delay, map, Observable, of, throwError } from "rxjs";
import { ToastrService } from 'ngx-toastr'; 
import { environment } from "src/environments/environment";
import { BaseHttpService } from "./base.http.service";


export interface IRepoDetails{
    repoId: number;
    repoName: string;
    repoOwner: string;
    isFavourite: boolean;
    count: number;
}

export const DEFAULT_REPO_DETAILS: IRepoDetails = {repoId: -1, repoOwner: '', repoName: '', 'isFavourite': false, count: 0};

export interface ICommitDetails{
    commitMessage: string;
    commitAuthorName: string;
    commitDateTime: string;
    commitPosition?: string;
}

export interface ILanguageDetails{
    language: string;
    bytesOfCode: number;
}

export interface IMonthYear{
    month: number;
    year: number;
}

@Injectable()
export class RepoService extends BaseHttpService{

    baseUrl : string = "";

    constructor(private http: HttpClient, router: Router, toastr: ToastrService){ 
        super(router, toastr);
        this.baseUrl = environment.webApiBaseUrl;
    }

    //Get list of repo (for user cookie)
    getRepoListAndUserDetails(): Observable<{userId: number, userName: string, userAvatarUrl: string, repoList: IRepoDetails[] }> {
        return this.http.get<{userId: number, userName: string, userAvatarUrl: string, repoList: IRepoDetails[] }>(this.baseUrl + '/api/DashBoard/GetUserDetails').pipe(
            catchError( error => {
                return this.handelError(error); // From 'rxjs'
            })
        );

    }

    //Get list of repo (for user cookie)
    getRepoList(): Observable<IRepoDetails[] > {
        return this.http.get<IRepoDetails[]>(this.baseUrl + '/api/DashBoard/GetUserRepoList').pipe(
            catchError( error => {
                return this.handelError(error); // From 'rxjs'
            })
        );

    }

    //Get commit history for a specific repository (for user cookie)
    getRepoCommitHistory(owner: string, repoName: string, pageNum: number = 1, pageLength: number = Infinity): Observable<{commitList: ICommitDetails[], repoName: string, pageNumber: number, pageLength: number, owner: string}>{
        let params = new HttpParams().set("ownerName", owner).set("repoName", repoName).set("pageSize", pageLength).set("pageNumber", pageNum);
        return this.http.get<ICommitDetails[]>(this.baseUrl + '/api/Dashboard/GetPaginatedCommits', {params: params}).pipe(map((response: ICommitDetails[])=>{
            return {commitList: response, repoName: repoName, pageNumber: pageNum, pageLength: pageLength, owner: owner};
        }),
        catchError( error => {
            return this.handelError(error); // From 'rxjs'
        })
        );
    }


    //Get month year pair for specific repository (for user cookie)
    getMonthYearListForRepo(owner: string, repoName: string) : Observable<{month: string, year: string}[]> {
        let params = new HttpParams().set("ownerName", owner).set("repoName", repoName);
        return this.http.get<{month: string, year: string}[]>(this.baseUrl + '/api/Dashboard/GetMonthYearList', {params: params}).pipe(
            catchError( error => {
                return this.handelError(error); // From 'rxjs'
            })
        );
    }

    getGraphData(owner: string, repoName: string, month: string, year: string): Observable<{result: {commits: number, day: number}[], owner: string, repoName: string, month: string, year: string}>{

        let params = new HttpParams().set("ownerName", owner).set("repoName", repoName).set("month", month).set("year", year);
        return this.http.get<{commits: number, day: number}[]>(this.baseUrl + '/api/Dashboard/GetDateCount', {params: params}).pipe(map((response: {commits: number, day: number}[])=>{
            return {result: response, owner: owner, repoName: repoName, month: month, year: year};
        }),
        catchError( error => {
            return this.handelError(error); // From 'rxjs'
        })
        );
    }

    getRepoLanguages(owner: string, repoName: string): Observable<ILanguageDetails[]>{

        let params = new HttpParams().set("ownerName", owner).set("repoName", repoName);
        return this.http.get<ILanguageDetails[]>(this.baseUrl + '/api/Dashboard/GetRepoLanguages', {params: params}).pipe(
            catchError( error => {
                return this.handelError(error); // From 'rxjs'
            })
        );
    }

    getRepoDetails(owner: string, repoName: string): Observable<{createdDate: Date, updatedDate: Date, repoLink: string, repoName: string, owner: string}>{
        let params = new HttpParams().set("ownerName", owner).set("repoName", repoName);
        return this.http.get<{createdAt: string, updatedAt: string, repoLink: string, repoName: string, owner: string}>(this.baseUrl + '/api/Dashboard/GetParticularRepoDetails', {params: params}).pipe(
            map((response: {createdAt: string, updatedAt: string, repoLink: string, repoName: string, owner: string})=>{
            return {createdDate: new Date(response.createdAt), updatedDate: new Date(response.updatedAt), repoLink: response.repoLink, repoName: response.repoName, owner: response.owner};
        }),
        catchError( error => {
            return this.handelError(error); // From 'rxjs'
        }));
    }


    

}