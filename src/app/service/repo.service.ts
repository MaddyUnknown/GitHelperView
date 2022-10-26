import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { delay, Observable, of } from "rxjs";


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
    constructor(private http: HttpClient){ }

    //Get list of repo (for user cookie)
    getRepoListAndUserDetails(): Observable<{userAvatarUrl: string, repoList: IRepoDetails[] }> {
        return this.http.get<{userAvatarUrl: string, repoList: IRepoDetails[] }>('/api/DashBoard/GetUserDetails');

    }

    //Get commit history for a specific repository (for user cookie)
    getRepoCommitHistory(owner: string, repoName: string, pageNum: number = 1, pageLength: number = Infinity): Observable<ICommitDetails[]>{
        let params = new HttpParams().set("ownerName", owner).set("repoName", repoName).set("pageSize", pageLength).set("pageNumber", pageNum);
        return this.http.get<ICommitDetails[]>('api/Dashboard/GetPaginatedCommits', {params: params});
    }


    //Get month year pair for specific repository (for user cookie)
    getMonthYearListForRepo(owner: string, repoName: string) : Observable<{month: string, year: string}[]> {
        let params = new HttpParams().set("ownerName", owner).set("repoName", repoName);
        return this.http.get<{month: string, year: string}[]>('api/Dashboard/GetMonthYearList', {params: params});
    }

    getGraphData(owner: string, repoName: string, month: string, year: string): Observable<{commits: number, day: number}[]>{

        let params = new HttpParams().set("ownerName", owner).set("repoName", repoName).set("month", month).set("year", year);
        return this.http.get<{commits: number, day: number}[]>('api/Dashboard/GetDateCount', {params: params});
    }

    // getRepoInformation(owner: string, repoName: string): Observable<{numOfColaborators: number, languageList: ILanguageDetails[]}>{
    //     const result : {numOfColaborators: number, languageList: ILanguageDetails[]} = {numOfColaborators: 24, languageList: [{language: "C#", bytesOfCode: 35978},
    //                                                                                                                             {language: "ASP.NET", bytesOfCode: 20532},
    //                                                                                                                             {language: "CSS", bytesOfCode: 2204},
    //                                                                                                                             {language: "JavaScript", bytesOfCode: 302}
    //                                                                                                                             ]};
    //     return of(result);
    // }

    getRepoLanguages(owner: string, repoName: string): Observable<ILanguageDetails[]>{

        let params = new HttpParams().set("ownerName", owner).set("repoName", repoName);
        return this.http.get<ILanguageDetails[]>('api/Dashboard/GetRepoLanguages', {params: params});
    }

}