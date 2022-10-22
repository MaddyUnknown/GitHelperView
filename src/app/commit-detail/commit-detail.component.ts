import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { DEFAULT_REPO_DETAILS, IRepoDetails, RepoService, ICommitDetails } from '../service/repo.service';

@Component({
  selector: 'commit-detail',
  templateUrl: './commit-detail.component.html',
  styleUrls: ['./commit-detail.component.css']
})
export class CommitDetailComponent implements OnInit {

  @Input()
  repositoryDetails: IRepoDetails = DEFAULT_REPO_DETAILS;

  commitList? : ICommitDetails[];

  constructor(private repoService: RepoService) {
  
  }

  ngOnInit(): void {
  }
    
  ngOnChanges(changes: SimpleChanges){
    if(changes.repositoryDetails != null && this.repositoryDetails.owner!=''){
      this.initAfterRepoSelection();
    }
  }

  initAfterRepoSelection() {
    // Fetch commitList from api based on repositoryDetails
    this.repoService.getRepoCommitHistory(this.repositoryDetails.owner, this.repositoryDetails.repoName).subscribe((data: ICommitDetails[])=>{
      this.commitList = data;
    })
  }
    





}
