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
import { PopUpComponent } from '../pop-up/pop-up.component';
import { ThisReceiver } from '@angular/compiler';
import { RepoDbService } from '../service/repoDb.service';

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

  @ViewChild(PopUpComponent) popUp: PopUpComponent;

  selectedRepositoryValue: number = -1;

  repoList: IRepoDetails[];

  userAvatarUrl?: string;

  userName: string;

  userId: number;

  //Repo Details
  languagesList?: ILanguageDetails[];

  repoCreationDate: Date| undefined = undefined;

  repoUpdateDate: Date | undefined = undefined;

  repoOwner: string = "";

  repoName: string = "";

  repoUrl: string = "";

  repoIsFavourite: boolean = false;

  //Repository Language Chart Variable Declarations
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

  constructor(private repoService : RepoService, private repoDbService : RepoDbService, private authService: AuthenticationService, private router : Router, private toastr: ToastrService, private userPrefService: UserPreferenceService, private themeService: ThemeService) { }

  ngOnInit(): void {
    //this.refreshDropdown();
    this.repoService.getRepoListAndUserDetails().subscribe({
        next:(data: {userId: number, userName: string, userAvatarUrl: string, repoList: IRepoDetails[] })=>{
          this.repoList = data.repoList;
          this.userAvatarUrl = data.userAvatarUrl;
          this.userId = data.userId;
          this.userName = data.userName;
          this.refreshDropdown();
          if(this.repoList.length !== 0){
            this.reorderRepoList();
            this.selectedRepositoryValue = 0;
            this.initOnRepoSelection('0');
            this.refreshDropdown();
          }
        },
        error: (error)=>{
          if(error !== "suppressed")
            this.toastr.error("An error occured while fetching repository list", "Error");
        },
        complete: ()=>{
          this.refreshDropdown();
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

  refreshDropdown(){
    setTimeout(() => {
      $(this.repoDropDown.nativeElement).selectpicker('refresh');
    });
  }

  reorderRepoList(){
    let selectedRepository : IRepoDetails;
    if(this.selectedRepositoryValue !== -1)
      selectedRepository = this.repoList[this.selectedRepositoryValue];
    this.repoList.sort(function comparator(a: IRepoDetails,b: IRepoDetails): number { 
      if(a.isFavourite! > b.isFavourite!){
        return -1;
      }
      else if(a.isFavourite! < b.isFavourite!){
        return 1;
      }
      else if(a.repoName.toLowerCase() < b.repoName.toLowerCase()) {
        return -1;
      }
      else if(a.repoName.toLowerCase() > b.repoName.toLowerCase()) {
        return 1;
      }
      else if(a.repoOwner.toLowerCase() < b.repoOwner.toLowerCase()){
        return -1;
      }
      else if(a.repoOwner.toLowerCase() > b.repoOwner.toLowerCase()){
        return 1;
      }
      return 0;
    });
    if(this.selectedRepositoryValue !== -1)
      this.selectedRepositoryValue = this.repoList.findIndex((obj)=>(obj.repoName === selectedRepository.repoName && obj.repoOwner === selectedRepository.repoOwner));

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
    this.repoIsFavourite = repoObj.isFavourite!;
    this.repoService.getRepoLanguages(repoObj.repoOwner, repoObj.repoName).subscribe({
      next: (data: ILanguageDetails[])=> {
        //Call child component change only when Repo details were fetched correctly
         this.commitDetailsComp.repositoryDetails = repoObj;
         this.commitGraphComp.repositoryDetails = repoObj;

        this.languagesList = data;

        this.languageLabel = this.languagesList?.map((x)=> x.language);
        this.languageData = this.languagesList?.map((x)=> x.bytesOfCode);
        this.refreshChart();

        this.repoService.getRepoOtherDetails(repoObj.repoOwner, repoObj.repoName).subscribe({
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
      this.themeService.setTheme("Dark");
    }
    else{
      this.themeService.setTheme("Light");
    }
  }

  changeToNextTheme() {
    this.themeService.setNextTheme();
  }

  changeToPreviousTheme() {
    this.themeService.setPreviousTheme();
  }

  // FAVOURITE FUNCTIONALITIES
  favouriteChangeHandler() {
    if(this.repoIsFavourite === true) {
      this.unfavourite();
    }
    else{
      this.changeFavourite();
    }
  }

  getFavouriteRepo(): IRepoDetails | undefined{
    let favouriteRepo = this.repoList.find((obj)=>obj.isFavourite === true);
    if(favouriteRepo !== undefined){
      return favouriteRepo;
    }
    else{
      return undefined;
    }
  }

  async changeFavourite() {
    let newFavouriteRepo = this.repoList[this.selectedRepositoryValue];
    let oldFavouriteRepo = this.getFavouriteRepo();
    let heading = "Confirmation";
    let body = `Are you sure you will like to set ${newFavouriteRepo.repoName} as the new favourite repository`;
    if(oldFavouriteRepo === undefined){
      body += " ?";
    }
    else{
      body += ` instead of ${oldFavouriteRepo.repoName}?`;
    }

    if((await this.popUp.showPrompt(heading, body)) === true){
      this.repoDbService.setFavourite(this.userId, newFavouriteRepo.repoId!).subscribe({
        next: (data: {status: string, message: string})=>{
          if(data.status === "Success"){
            if(oldFavouriteRepo !== undefined)
              oldFavouriteRepo!.isFavourite = false;
            this.repoIsFavourite = true;
            this.repoList.find((obj)=>obj.repoName === newFavouriteRepo.repoName)!.isFavourite = true;
            this.reorderRepoList();
            this.refreshDropdown();
          }
          else {
            this.toastr.error(data.message, data.status);
          }
        },
        error: (error)=>{
          if(error !== "suppressed")
            this.toastr.error("An error occured while removing favourite repository", "Error");
        }
      });
    }

  }

  async unfavourite() {
    let favouriteRepo = this.repoList[this.selectedRepositoryValue];
    let heading = "Confirmation";
    let body = `Are you sure you will like to remove ${favouriteRepo.repoName} as the favourite repository ?`;

    if((await this.popUp.showPrompt(heading, body)) === true) {
      this.repoDbService.removeFavourite(this.userId, favouriteRepo.repoId!).subscribe({
        next: (data: {status: string, message: string})=>{
          if(data.status === "Success"){
            this.repoIsFavourite = false;
            this.repoList.find((obj)=>obj.repoName === favouriteRepo.repoName)!.isFavourite = false;
            this.reorderRepoList();
            this.refreshDropdown();
          }
          else {
            this.toastr.error(data.message, data.status);
          }
        },
        error: (error)=>{
          if(error !== "suppressed")
            this.toastr.error("An error occured while removing favourite repository", "Error");
        }
      });
      
    };
  }


}
