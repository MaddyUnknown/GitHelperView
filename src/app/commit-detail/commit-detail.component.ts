import { Component, Input, OnInit, SimpleChanges, ɵɵsetComponentScope } from '@angular/core';
import { DEFAULT_REPO_DETAILS, IRepoDetails, RepoService, ICommitDetails } from '../service/repo.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';  


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


  currentPageNumber: number = 0;

  hasMoreData : boolean = true;

  constructor(private repoService: RepoService, private spinner: NgxSpinnerService, private toastr: ToastrService) {
  
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
    // console.log("here");
    this.hasMoreData = true;
    this.currentPageNumber = 0;
    this.commitList = [];
    this.getNextPage();
  }

  onScrollDown(event: any){
    // console.log("scrolled down");
    this.getNextPage()
  }

  getNextPage() {
    this.currentPageNumber = this.currentPageNumber+1;
    // console.log("scrolled triggered");
    // console.log(this.hasMoreData, this.currentPageNumber);
    if(this.hasMoreData){
      // console.log(`Data sent: Repo Owner: ${this.repositoryDetails.owner}, RepoName: ${this.repositoryDetails.repoName}, CurretnPageNum: ${this.currentPageNumber}, Num in page: ${this.entryPerPage}}`);
      this.spinner.show("commit-spinner");
      this.repoService.getRepoCommitHistory(this.repositoryDetails.owner, this.repositoryDetails.repoName, this.currentPageNumber, this.entryPerPage).subscribe({
        next: (data: {commitList: ICommitDetails[], repoName: string, pageNumber: number, pageLength: number, owner: string})=>{
          // console.log("Data received: ", data);
          // console.log(data.pageNumber === this.currentPageNumber);
          // console.log(data.pageLength === this.entryPerPage);
          // console.log(data.repoName === this.repositoryDetails.repoName);
          // console.log(data.owner === this.repositoryDetails.owner);
          if(data.pageNumber === this.currentPageNumber && data.pageLength === this.entryPerPage && data.repoName === this.repositoryDetails.repoName && data.owner === this.repositoryDetails.owner){
            this.commitList = this.commitList?.concat(data.commitList);
            if(data.commitList.length < this.entryPerPage){
              this.hasMoreData = false;
            }
            this.spinner.hide("commit-spinner");
          }
          else{
            // console.log("page discarded");
          }
        },
        error: (error)=>{
          this.toastr.error("An Error Occured while Fetching Commits", "Error");
          this.spinner.hide("commit-spinner");
        },
        complete: () =>{
          
        }
      })
      
    }
  }
    





}
