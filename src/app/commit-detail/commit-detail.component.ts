import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { DEFAULT_REPO_DETAILS, IRepoDetails, RepoService, ICommitDetails } from '../service/repo.service';

@Component({
  selector: 'commit-detail',
  templateUrl: './commit-detail.component.html',
  styleUrls: ['./commit-detail.component.css']
})
export class CommitDetailComponent implements OnInit {

  readonly entryPerPage: number = 50;

  @Input()
  repositoryDetails: IRepoDetails = DEFAULT_REPO_DETAILS;

  commitList? : ICommitDetails[];


  currentPageNumber: number = -1;

  hasMoreData : boolean = true;

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
    console.log("here");
    this.hasMoreData = true;
    this.currentPageNumber = -1;
    this.commitList = [];
    this.getNextPage();
  }

  onScrollDown(event: any){
    console.log("scrolled down");
    this.getNextPage()
  }

  getNextPage() {
    this.currentPageNumber = this.currentPageNumber+1;
    console.log("scrolled triggered");
    console.log(this.hasMoreData, this.currentPageNumber);
    if(this.hasMoreData){
      this.repoService.getRepoCommitHistory(this.repositoryDetails.owner, this.repositoryDetails.repoName, this.currentPageNumber, this.entryPerPage).subscribe((data: ICommitDetails[])=>{
        this.commitList = this.commitList?.concat(data);
        if(data.length < this.entryPerPage){
          this.hasMoreData = false;
        }
      })
    }
  }
    





}
