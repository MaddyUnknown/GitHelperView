import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, delay, map, Observable, of, throwError } from "rxjs";
import { ToastrService } from 'ngx-toastr'; 
import { environment } from "src/environments/environment";


export interface IRepoDetails{
    repoId: number;
    repoName: string;
    repoOwner: string;
    isFavourite: boolean;
}

export const DEFAULT_REPO_DETAILS: IRepoDetails = {repoId: -1, repoOwner: '', repoName: '', 'isFavourite': false};

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
export class RepoService{

    baseUrl : string = "";

    constructor(private http: HttpClient, private router: Router, private toastr: ToastrService){ 
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

    // //Dummy test
    // getRepoListAndUserDetails(): Observable<{userAvatarUrl: string, repoList: IRepoDetails[] }> {
    //     const data:  {userAvatarUrl: string, repoList: IRepoDetails[] }= {
    //         userAvatarUrl: "https://avatars.githubusercontent.com/u/56967184?v=4",
    //         repoList: [
    //           {
    //             repoName: "cb31",
    //             owner: "gittygupta",
    //             isFavourite: false
    //           },
    //           {
    //             "repoName": "uav-detection-and-tracking",
    //             "owner": "gittygupta",
    //             isFavourite: false
    //           },
    //           {
    //             "repoName": "video-summarization",
    //             "owner": "gittygupta",
    //             isFavourite: false
    //           },
    //           {
    //             "repoName": "Application-form-Tkinter",
    //             "owner": "MaddyUnknown",
    //             isFavourite: false
    //           },
    //           {
    //             "repoName": "BlueBus-BusMangementSystem",
    //             "owner": "MaddyUnknown",
    //             isFavourite: false
    //           },
    //           {
    //             "repoName": "bootstrap",
    //             "owner": "MaddyUnknown",
    //             isFavourite: false
    //           },
    //           {
    //             "repoName": "buddingtree",
    //             "owner": "MaddyUnknown",
    //             isFavourite: false
    //           },
    //           {
    //             "repoName": "Cat-vs-Dog-Classifier",
    //             "owner": "MaddyUnknown",
    //             isFavourite: false
    //           },
    //           {
    //             "repoName": "competitive-programming",
    //             "owner": "MaddyUnknown",
    //             isFavourite: false
    //           },
    //           {
    //             "repoName": "DotNET-Practice-Session",
    //             "owner": "MaddyUnknown",
    //             isFavourite: false
    //           },
    //           {
    //             "repoName": "excursion",
    //             "owner": "MaddyUnknown",
    //             isFavourite: false
    //           },
    //           {
    //             "repoName": "GitHelperView",
    //             "owner": "MaddyUnknown",
    //             isFavourite: false
    //           },
    //           {
    //             "repoName": "GoogleDino_CNN-model",
    //             "owner": "MaddyUnknown",
    //             isFavourite: false
    //           },
    //           {
    //             "repoName": "HiveMind-Concept",
    //             "owner": "MaddyUnknown",
    //             isFavourite: false
    //           },
    //           {
    //             "repoName": "HTML-CSS",
    //             "owner": "MaddyUnknown",
    //             isFavourite: false
    //           },
    //           {
    //             "repoName": "lably",
    //             "owner": "MaddyUnknown",
    //             isFavourite: false
    //           },
    //           {
    //             "repoName": "MaddyUnknown",
    //             "owner": "MaddyUnknown",
    //             isFavourite: false
    //           },
    //           {
    //             "repoName": "Object-Detection-and-Tracking",
    //             "owner": "MaddyUnknown",
    //             isFavourite: false
    //           },
    //           {
    //             "repoName": "Resume.io",
    //             "owner": "MaddyUnknown",
    //             isFavourite: false
    //           },
    //           {
    //             "repoName": "Sign-language-live-predictor",
    //             "owner": "MaddyUnknown",
    //             isFavourite: false
    //           },
    //           {
    //             "repoName": "testrepo1",
    //             "owner": "MaddyUnknown",
    //             isFavourite: false
    //           },
    //           {
    //             "repoName": "Tkinter-Calcutator",
    //             "owner": "MaddyUnknown",
    //             isFavourite: false
    //           },
    //           {
    //             "repoName": "To-Do-List.github-io",
    //             "owner": "MaddyUnknown",
    //             isFavourite: false
    //           },
    //           {
    //             "repoName": "Xfactor-FrontEnd-Angular",
    //             "owner": "MaddyUnknown",
    //             isFavourite: false
    //           },
    //           {
    //             "repoName": "Xfactor-FullStack-Assignment",
    //             "owner": "MaddyUnknown",
    //             isFavourite: false
    //           },
    //           {
    //             "repoName": "ZooHackathon2019",
    //             "owner": "MaddyUnknown",
    //             isFavourite: false
    //           },
    //           {
    //             "repoName": "Sign-language-live-predictor",
    //             "owner": "rishabgit",
    //             isFavourite: false
    //           },
    //           {
    //             "repoName": "ZooHackathon2019",
    //             "owner": "rishabgit",
    //             isFavourite: false
    //           },
    //           {
    //             "repoName": "Web-api-call",
    //             "owner": "Sjaiswal08",
    //             isFavourite: false
    //           },
    //           {
    //             "repoName": "GitHelper",
    //             "owner": "SumedhaSamanta",
    //             isFavourite: false
    //           }
    //         ]
    //       }
    //     return of(data);

    // }

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

    getRepoOtherDetails(owner: string, repoName: string): Observable<{createdDate: Date, updatedDate: Date, repoLink: string, repoName: string, owner: string}>{
        let params = new HttpParams().set("ownerName", owner).set("repoName", repoName);
        return this.http.get<{createdAt: string, updatedAt: string, repoLink: string, repoName: string, owner: string}>(this.baseUrl + '/api/Dashboard/GetParticularRepoDetails', {params: params}).pipe(
            map((response: {createdAt: string, updatedAt: string, repoLink: string, repoName: string, owner: string})=>{
            return {createdDate: new Date(response.createdAt), updatedDate: new Date(response.updatedAt), repoLink: response.repoLink, repoName: response.repoName, owner: response.owner};
        }),
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