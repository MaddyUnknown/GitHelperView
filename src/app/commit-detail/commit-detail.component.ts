import { Component, OnInit } from '@angular/core';
import {ICommitDetails} from './commit-detail.interface';

@Component({
  selector: 'commit-detail',
  templateUrl: './commit-detail.component.html',
  styleUrls: ['./commit-detail.component.css']
})
export class CommitDetailComponent implements OnInit {

  commitList? : ICommitDetails[];

  constructor() {
    this.commitList = [{commitAuthorName:'MaddyUnknown', commitMessage:"AVST-2256: Creating new feature super important feature but the feauter has bugs so kudos", commitDateTime:'2023-09-27T05:57:47Z'},
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
                       {commitAuthorName:'MaddyUnknown', commitMessage:"Initial Commit", commitDateTime:'2022-09-27T05:57:47Z'}]
  
  }

  ngOnInit(): void {
  }
    
    





}
