import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { AuthenticationService } from '../service/auth.service';
import { DEFAULT_REPO_DETAILS, ILanguageDetails, IRepoDetails, RepoService } from '../service/repo.service';
import { ToastrService } from 'ngx-toastr'; 

declare var $: any;

@Component({
  selector: 'home-component',
  templateUrl: './home-component.component.html',
  styleUrls: ['./home-component.component.css']
})
export class HomeComponentComponent implements OnInit {

  @ViewChild('repoDetailsView') repoDetailsView:ElementRef; 
  @ViewChild('commitDetailsView') commitDetailsView:ElementRef; 
  @ViewChild('repoDropDown') repoDropDown:ElementRef; 

  selectedRepositoryDetails: string = JSON.stringify(DEFAULT_REPO_DETAILS);

  repoList?: IRepoDetails[];

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
          this.toastr.error("An Error Occured While Fetching Repository List", "Error");
        }
    })
  }

  refreshDropdown(){
    setTimeout(() => {
      $(this.repoDropDown.nativeElement).selectpicker('refresh');
    });
  }

  initOnRepoSelection(value: string){
    let repoObj : IRepoDetails = JSON.parse(value);
    this.repoService.getRepoLanguages(repoObj.owner, repoObj.repoName).subscribe({
      next: (data: ILanguageDetails[])=> {
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
        this.toastr.error("An Error Occured While Fetching Repository Languages", "Error");
      }
    });
  }

  logout(){
    this.authService.logout().subscribe({
      next: (value : {status: string, message: string})=>{
        if(value.status === "Success"){
          this.toastr.success(value.message, value.status);
        }
        else{
          this.toastr.error(value.message, value.status);
        }
      },
      error: (error)=>{
        //this.toastr.error("Error Occured", "Error");
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
