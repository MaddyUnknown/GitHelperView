import { Component, Input, OnInit } from '@angular/core';
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

  @Input() set repositoryDetails(value: IRepoDetails) {
    this._repositoryDetails = value;
    this.changeRepo();
  }

  private _repositoryDetails : IRepoDetails = DEFAULT_REPO_DETAILS;

  commitList : ICommitDetails[];


  currentPageNumber: number = 0;

  hasMoreData : boolean = true;

  constructor(private repoService: RepoService, private spinner: NgxSpinnerService, private toastr: ToastrService) {
  
  }

  ngOnInit(): void {
  }
    
  changeRepo(){
    if(this._repositoryDetails != null && this._repositoryDetails.owner!=''){
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
      this.repoService.getRepoCommitHistory(this._repositoryDetails.owner, this._repositoryDetails.repoName, this.currentPageNumber, this.entryPerPage).subscribe({
        next: (data: {commitList: ICommitDetails[], repoName: string, pageNumber: number, pageLength: number, owner: string})=>{
          // console.log("Data received: ", data);
          // console.log(data.pageNumber === this.currentPageNumber);
          // console.log(data.pageLength === this.entryPerPage);
          // console.log(data.repoName === this.repositoryDetails.repoName);
          // console.log(data.owner === this.repositoryDetails.owner);
          if(data.pageNumber === this.currentPageNumber && data.pageLength === this.entryPerPage && data.repoName === this._repositoryDetails.repoName && data.owner === this._repositoryDetails.owner){
            let commitListData: ICommitDetails[] = data.commitList.map((value: ICommitDetails, index: number)=>{
              if(this.commitList.length === 0 && data.commitList.length === 1){
                value.commitPosition = "";
              }
              else if(this.commitList.length === 0 && index === 0){
                value.commitPosition = "guide-line-first";
              }
              else{
                value.commitPosition = "guide-line-full";
              }
              return value;
            })
            this.commitList = this.commitList?.concat(commitListData);
            if(data.commitList.length < this.entryPerPage){
              this.hasMoreData = false;
              if(this.commitList.length > 1)
                this.commitList[this.commitList.length-1].commitPosition = "guide-line-last";
            }
            this.spinner.hide("commit-spinner");
          }
          else{
            // console.log("page discarded");
          }
        },
        error: (error)=>{
          if(error !== "suppressed")
            this.toastr.error("An error occured while fetching commits list", "Error");
          this.spinner.hide("commit-spinner");
        },
        complete: () =>{
          
        }
      })
      
    }
  }
    





}
