import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";


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
    constructor(){ }

    //Get list of repo (for user cookie)
    getRepoListAndUserDetails(): Observable<{userAvatarUrl: string, repoList: IRepoDetails[] }> {
        const returnObj: {userAvatarUrl: string, repoList: IRepoDetails[] }={userAvatarUrl: "https://avatars.githubusercontent.com/u/56967184?v=4",
                                                                                repoList: [{repoName: 'Tkinter-Calculator', owner: 'MaddyUnknown'},
                                                                                            {repoName: 'HiveMind', owner: 'MaddyUnknown'},
                                                                                            {repoName: 'BrainBoost', owner: 'MaddyUnknown'},
                                                                                            {repoName: 'Serco', owner: 'MaddyUnknown'},
                                                                                            {repoName: 'Parasetaniousis', owner: 'MaddyUnknown'},
                                                                                            {repoName: 'Counter Strik: GO', owner: 'StingerM'}]
                                                                    };
        
        return of(returnObj);

    }

    //Get commit history for a specific repository (for user cookie)
    getRepoCommitHistory(owner: string, repoName: string, pageNum: number = 1, pageLength: number = Infinity): Observable<ICommitDetails[]>{
        const commitList: ICommitDetails[] = [{commitAuthorName:'MaddyUnknown', commitMessage:"AVST-2256: Creating new feature super important feature but the feauter has bugs so kudos "+repoName, commitDateTime:'2023-09-27T05:57:47Z'},
                                            {commitAuthorName:'MaddyUnknown', commitMessage:"Initial Commit", commitDateTime:'2022-09-27T05:57:47Z'},
                                            {commitAuthorName:'MaddyUnknown', commitMessage:"Initial Commit", commitDateTime:'2022-09-27T05:57:47Z'},
                                            {commitAuthorName:'MaddyUnknown', commitMessage:"Initial Commit", commitDateTime:'2022-09-27T05:57:47Z'},
                                            {commitAuthorName:'MaddyUnknown', commitMessage:"Initial Commit", commitDateTime:'2022-09-27T05:57:47Z'},
                                            {commitAuthorName:'MaddyUnknown', commitMessage:"Initial Commit", commitDateTime:'2022-09-27T05:57:47Z'},
                                            {commitAuthorName:'MaddyUnknown', commitMessage:"Initial Commit", commitDateTime:'2022-09-27T05:57:47Z'},
                                            {commitAuthorName:'MaddyUnknown', commitMessage:"Initial Commit", commitDateTime:'2022-09-27T05:57:47Z'},
                                            {commitAuthorName:'MaddyUnknown', commitMessage:"Initial Commit", commitDateTime:'2022-09-27T05:57:47Z'},
                                            {commitAuthorName:'MaddyUnknown', commitMessage:"Initial Commit", commitDateTime:'2022-09-27T05:57:47Z'},
                                            {commitAuthorName:'MaddyUnknown', commitMessage:"Initial Commit", commitDateTime:'2022-09-27T05:57:47Z'},
                                            {commitAuthorName:'MaddyUnknown', commitMessage:"Initial Commit", commitDateTime:'2022-09-27T05:57:47Z'},
                                            {commitAuthorName:'MaddyUnknown', commitMessage:"Initial Commit", commitDateTime:'2022-09-27T05:57:47Z'},
                                            {commitAuthorName:'MaddyUnknown', commitMessage:"Initial Commit", commitDateTime:'2022-09-27T05:57:47Z'},
                                            {commitAuthorName:'MaddyUnknown', commitMessage:"AVST-2256: Creating new feature super important feature but the feauter has bugs so kudos", commitDateTime:'2022-09-27T05:57:47Z'},
                                            {commitAuthorName:'MaddyUnknown', commitMessage:"Initial Commit", commitDateTime:'2022-09-27T05:57:47Z'},
                                            {commitAuthorName:'MaddyUnknown', commitMessage:"Initial Commit", commitDateTime:'2022-09-27T05:57:47Z'},
                                            {commitAuthorName:'MaddyUnknown', commitMessage:"Initial Commit", commitDateTime:'2022-09-27T05:57:47Z'},
                                            {commitAuthorName:'MaddyUnknown', commitMessage:"Initial Commit", commitDateTime:'2022-09-27T05:57:47Z'},
                                            {commitAuthorName:'MaddyUnknown', commitMessage:"Initial Commit", commitDateTime:'2022-09-27T05:57:47Z'}];
        return of(commitList);
    }


    //Get month year pair for specific repository (for user cookie)
    getMonthYearListForRepo(owner: string, repoName: string) : Observable<{month: string, year: string}[]> {
        const monthYearList: {month: string, year: string}[] =   [
                                                                    {month: "June", year: "2018"},
                                                                    {month: "May", year: "2018"},
                                                                    {month: "April", year: "2018"},
                                                                    {month: "March", year: "2018"},
                                                                    {month: "February", year: "2018"},
                                                                ];
        return of(monthYearList);
    }

    getGraphData(owner: string, repoName: string, month: string, year: string): Observable<{commits: number, day: number}[]>{
        console.log(`Graph data inputs: ${owner}, ${repoName}, ${month}, ${year}`);
        const graphData: {commits:number, day: number}[] = Array.from({length: 40}, (_, i) => {return {commits: Math.floor(Math.random()*30), day: i+1}});

        return of(graphData);
    }

    getRepoInformation(owner: string, repoName: string): Observable<{numOfColaborators: number, languageList: ILanguageDetails[]}>{
        const result : {numOfColaborators: number, languageList: ILanguageDetails[]} = {numOfColaborators: 24, languageList: [{language: "C#", bytesOfCode: 35978},
                                                                                                                                {language: "ASP.NET", bytesOfCode: 20532},
                                                                                                                                {language: "CSS", bytesOfCode: 2204},
                                                                                                                                {language: "JavaScript", bytesOfCode: 302}
                                                                                                                                ]};
        return of(result);
    }

}