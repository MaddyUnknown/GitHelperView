import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { AuthenticationService } from '../service/auth.service';
import { DEFAULT_REPO_DETAILS, ILanguageDetails, IRepoDetails, RepoService } from '../service/repo.service';
import { ToastrService } from 'ngx-toastr'; 
import { CommitDetailComponent } from '../commit-detail/commit-detail.component';
import { CommitGraphComponent } from '../commit-graph/commit-graph.component';
import { UserPreferenceService } from '../service/user.preference.service';
import { ITheme, ThemeService } from '../service/theme.service';
import { reduce } from 'rxjs';

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

  //Repo Details
  languagesList?: ILanguageDetails[];

  repoCreationDate: Date| undefined = undefined;

  repoUpdateDate: Date | undefined = undefined;

  repoOwner: string = "";

  repoName: string = "";

  repoUrl: string = "";

  //Chart Variable Declarations
  chartType : ChartType = 'pie';
  
  chartData?: ChartData<ChartType>;

  languageLabel?: string[];
  
  languageData?: number[];

  backgroundColors: any = ['#1D8F6D', '#385855', '#CFC69B', '#90D7FF', '#896978', '#F45B69'];

  chartLabels?: string[];

  chartOptions : ChartOptions = {
    plugins: {
      legend: {
        labels: {
          color: 'white'
        }
      }
    }
  };

  constructor(private repoService : RepoService, private authService: AuthenticationService, private router : Router, private toastr: ToastrService, private userPrefService: UserPreferenceService, private themeService: ThemeService) { }

  ngOnInit(): void {
    this.refreshDropdown();
    this.repoService.getRepoListAndUserDetails().subscribe({
        next:(data: {userAvatarUrl: string, repoList: IRepoDetails[] })=>{
          this.repoList = data.repoList;
          this.userAvatarUrl = data.userAvatarUrl;
          this.refreshDropdown();
          if(this.repoList.length !== 0){
            this.selectedRepositoryValue = 0;
            this.refreshDropdown();
            this.initOnRepoSelection('0');
          }
        },
        error: (error)=>{
          if(error !== "suppressed")
            this.toastr.error("An error occured while fetching repository list", "Error");
        }
    });
    this.changeGraphColor(this.themeService.getThemeColorScheme());
    this.themeService.getThemeObs().subscribe({
      next: (value: ITheme)=>{
        this.changeGraphColor(value);
      },
      error: (error)=>{
        this.toastr.error("Error occured while changing theme", "Error");
      }
    });
    
  }

  refreshDropdown(){
    setTimeout(() => {
      $(this.repoDropDown.nativeElement).selectpicker('refresh');
    });
  }

  getUserName(): string {
    return this.authService.getAuthUserName();
  }

  getThemeName(): string {
    return this.themeService.getThemeName();
  }

  getPrefTimeOffset() : string{
    return this.userPrefService.getPreferedTimeOffset();
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

        this.languageLabel = this.languagesList?.map((x)=> x.language);
        this.languageData = this.languagesList?.map((x)=> x.bytesOfCode);
        this.refreshChart();

        this.repoService.getRepoOtherDetails(repoObj.owner, repoObj.repoName).subscribe({
          next: (data: {createdDate: Date, updatedDate: Date, repoLink: string, repoName: string, owner: string})=> {
            this.repoCreationDate = data.createdDate;
            this.repoUpdateDate = data.updatedDate;
            this.repoUrl = data.repoLink;
            this.repoName = data.repoName;
            this.repoOwner = data.owner;
          },
          error: (error)=>{
            if(error !== "suppressed")
              this.toastr.error("An error occured while fetching repository details", "Error");
          }
        });

      },
      error: (error)=>{
        if(error !== "suppressed")
          this.toastr.error("An error occured while fetching repository details", "Error");
      }
    });
  }

  changeGraphColor(color: ITheme){
    this.chartOptions!.plugins!.legend!.labels!.color = color.graphLineColor;
    this.backgroundColors = color.languageGraphColors;
    this.refreshChart();
  }

  refreshChart(): void {
    if(this.languageData !== undefined){
      this.chartData = {
        labels: this.languageLabel,
        datasets: [{
          label: 'Number of bytes used: ',
          data: this.languageData,
          hoverOffset: 4,
          backgroundColor: this.backgroundColors,
        }]
  
      }
    }
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
  @HostListener('window:resize', ['$event'])
    onResize(event: any) {
  }

  changeTheme(theme: any){
    //this.themeService.setTheme(theme);
    if(theme.checked){
      this.themeService.setTheme("dark");
    }
    else{
      this.themeService.setTheme("light");
    }
  }


}
