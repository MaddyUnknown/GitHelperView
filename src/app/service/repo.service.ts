import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, delay, map, Observable, of, throwError } from "rxjs";
import { ToastrService } from 'ngx-toastr'; 


export interface IRepoDetails{
    repoName: string;
    owner: string;
}

export const DEFAULT_REPO_DETAILS: IRepoDetails = {owner: '', repoName: ''};

export interface ICommitDetails{
    commitMessage: string;
    commitAuthorName: string;
    commitDateTime: string;
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
export class RepoService{
    constructor(private http: HttpClient, private router: Router, private toastr: ToastrService){ }

    //Get list of repo (for user cookie)
    getRepoListAndUserDetails(): Observable<{userAvatarUrl: string, repoList: IRepoDetails[] }> {
        return this.http.get<{userAvatarUrl: string, repoList: IRepoDetails[] }>('/api/DashBoard/GetUserDetails').pipe(
            catchError( error => {
                return this.handelError(error); // From 'rxjs'
            })
        );

    }

    //Get commit history for a specific repository (for user cookie)
    getRepoCommitHistory(owner: string, repoName: string, pageNum: number = 1, pageLength: number = Infinity): Observable<{commitList: ICommitDetails[], repoName: string, pageNumber: number, pageLength: number, owner: string}>{
        let params = new HttpParams().set("ownerName", owner).set("repoName", repoName).set("pageSize", pageLength).set("pageNumber", pageNum);
        return this.http.get<ICommitDetails[]>('api/Dashboard/GetPaginatedCommits', {params: params}).pipe(map((response: ICommitDetails[])=>{
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
        return this.http.get<{month: string, year: string}[]>('api/Dashboard/GetMonthYearList', {params: params}).pipe(
            catchError( error => {
                return this.handelError(error); // From 'rxjs'
            })
        );
    }

    getGraphData(owner: string, repoName: string, month: string, year: string): Observable<{result: {commits: number, day: number}[], owner: string, repoName: string, month: string, year: string}>{

        let params = new HttpParams().set("ownerName", owner).set("repoName", repoName).set("month", month).set("year", year);
        return this.http.get<{commits: number, day: number}[]>('api/Dashboard/GetDateCount', {params: params}).pipe(map((response: {commits: number, day: number}[])=>{
            return {result: response, owner: owner, repoName: repoName, month: month, year: year};
        }),
        catchError( error => {
            return this.handelError(error); // From 'rxjs'
        })
        );
    }

    getRepoLanguages(owner: string, repoName: string): Observable<ILanguageDetails[]>{

        let params = new HttpParams().set("ownerName", owner).set("repoName", repoName);
        return this.http.get<ILanguageDetails[]>('api/Dashboard/GetRepoLanguages', {params: params}).pipe(
            catchError( error => {
                return this.handelError(error); // From 'rxjs'
            })
        );
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