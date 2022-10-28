import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { AuthenticationService } from '../service/auth.service';
import { DEFAULT_REPO_DETAILS, ILanguageDetails, IRepoDetails, RepoService } from '../service/repo.service';
import { ToastrService } from 'ngx-toastr'; 
import { CommitDetailComponent } from '../commit-detail/commit-detail.component';
import { CommitGraphComponent } from '../commit-graph/commit-graph.component';

declare var $: any;

@Component({
  selector: 'home-component',
  templateUrl: './home-component-v2.component.html',
  styleUrls: ['./home-component-v2.component.css']
})
export class HomeComponentComponent implements OnInit {

  @ViewChild('repoDetailsView') repoDetailsView:ElementRef; 
  @ViewChild('commitDetailsView') commitDetailsView:ElementRef; 
  @ViewChild('repoDropDown') repoDropDown:ElementRef; 

  @ViewChild(CommitDetailComponent) commitDetailsComp: CommitDetailComponent;
  @ViewChild(CommitGraphComponent)  commitGraphComp: CommitGraphComponent;

  selectedRepositoryValue: number = -1;

  repoList: IRepoDetails[];

  userAvatarUrl?: string;

  languagesList?: ILanguageDetails[];

  //Chart Variable Declarations
  chartType : ChartType = 'pie';
  
  chartData?: ChartData<ChartType>;

  backgroundColors: any = ['#1D8F6D', '#385855', '#CFC69B', '#90D7FF', '#896978', '#F45B69'];

  chartLabels?: string[];

  chartOptions : ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        grid: {
          display: false
        }
      }
    }
  };

  constructor(private repoService : RepoService, private authService: AuthenticationService, private router : Router, private toastr: ToastrService) { }

  ngOnInit(): void {
      this.repoService.getRepoListAndUserDetails().subscribe({
        next:(data: {userAvatarUrl: string, repoList: IRepoDetails[] })=>{
          this.repoList = data.repoList;
          this.userAvatarUrl = data.userAvatarUrl;
          this.refreshDropdown();
        },
        error: (error)=>{
          if(error !== "suppressed")
            this.toastr.error("An error occured while fetching repository list", "Error");
        }
    })
  }

  refreshDropdown(){
    setTimeout(() => {
      $(this.repoDropDown.nativeElement).selectpicker('refresh');
    });
  }

  getUserName(): string {
    return this.authService.getAuthUserName();
  }

  initOnRepoSelection(value: string){
    let index: number = parseInt(value);
    let repoObj : IRepoDetails = this.repoList[index];
    this.repoService.getRepoLanguages(repoObj.owner, repoObj.repoName).subscribe({
      next: (data: ILanguageDetails[])=> {
        //Call child component change only when Repo details were fetched correctly
         this.commitDetailsComp.repositoryDetails = repoObj;
         this.commitGraphComp.repositoryDetails = repoObj;

        this.languagesList = data;

        let label = this.languagesList?.map((x)=> x.language);
        let labelData: any = this.languagesList?.map((x)=> x.bytesOfCode);
        this.chartData = {
          labels: label,
          datasets: [{
            label: 'Number of bytes used: ',
            data: labelData,
            hoverOffset: 4,
            backgroundColor: this.backgroundColors,
          }]

        }
      },
      error: (error)=>{
        console.log(error);
        if(error !== "suppressed")
          this.toastr.error("An error occured while fetching repository details", "Error");
      }
    });
  }

  logout(){
    this.authService.logout().subscribe({
      next: (value : {status: string, message: string})=>{
        // if(value.status === "Success"){
        //   this.toastr.success(value.message, value.status);
        // }
        // else{
        //   this.toastr.error(value.message, value.status);
        // }
      },
      error: (error)=>{
        
      }
    })
    this.router.navigateByUrl('/login');
  }

  // getWindowWidth(){
  //   return window.innerWidth;
  // }

  /*
    Needed to refresh the view everytime window size changes
    Why needed?: Everytime the screens aspect ratio changed drastically height of 'commitDetailsView' and 'repoDetailsView' were not the same (for devices greater than xl)
    Fix: A programatic approch is taken where the height of repoDetailsView is copied to height of commitDetailsView for xl devices.
    [style.height.px]="repoDetailsView.offsetHeight" is used in template and to trigger this hostlistener is required.
  */
  // @HostListener('window:resize', ['$event'])
  //   onResize(event: any) {
  // }


}
