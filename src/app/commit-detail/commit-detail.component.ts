import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import {ICommitDetails} from './commit-detail.interface';

@Component({
  selector: 'commit-detail',
  templateUrl: './commit-detail.component.html',
  styleUrls: ['./commit-detail.component.css']
})
export class CommitDetailComponent implements OnInit {

  @Input()
  repositoryName: string = '';

  commitList? : ICommitDetails[];

  constructor() {
  
  }

  ngOnInit(): void {
  }
    
  ngOnChanges(changes: SimpleChanges){
    if(changes.repositoryName != null){
      this.initAfterRepoSelection();
    }
  }

  initAfterRepoSelection() {
    // Fetch commitList from api based on repositoryName
    console.log("called");
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
    





}
