import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
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

interface IRepoContent {
  repoName: string;
  repoOwner: string;
  repoUrl: string;
  repoLanguageList : ILanguageDetails[] | undefined;
  repoCreationDate: Date | undefined;
  repoUpdateDate: Date | undefined;
  isFavourite: boolean;
}

class RepoContent implements IRepoContent {
  repoName: string;
  repoOwner: string;
  repoUrl: string;
  repoLanguageList: ILanguageDetails[] | undefined;
  repoCreationDate: Date | undefined;
  repoUpdateDate: Date | undefined;
  isFavourite: boolean;

  constructor(){
    this.repoName= "";
    this.repoOwner= "";
    this.repoUrl= "";
    this.repoLanguageList= undefined;
    this.repoCreationDate=  undefined;
    this.repoUpdateDate= undefined;
    this.isFavourite= false;
  }

}

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

  selectedRepositoryId: number = -1;

  repoList: IRepoDetails[];

  userAvatarUrl?: string;

  userName: string;

  userId: number;

  currentRepoDetails: IRepoContent = new RepoContent();


  //Repository Language Chart Variable Declarations
  chartType : ChartType = 'pie';
  
  chartData?: ChartData<ChartType>;

  chartBackgroundColors: any = ['#1D8F6D', '#385855', '#CFC69B', '#90D7FF', '#896978', '#F45B69'];

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
    this.repoService.getRepoListAndUserDetails().subscribe({
        next:(data: {userId: number, userName: string, userAvatarUrl: string, repoList: IRepoDetails[] })=>{
          this.repoList = data.repoList;
          this.userAvatarUrl = data.userAvatarUrl;
          this.userId = data.userId;
          this.userName = data.userName;
          //this.refreshRepoListDropdown();
          if(this.repoList.length !== 0){
            this.reorderRepoList();
            this.selectedRepositoryId = this.repoList[0].repoId;
            this.initOnRepoSelection(this.selectedRepositoryId);
            this.refreshRepoListDropdown();
          }
        },
        error: (error)=>{
          if(error !== "suppressed")
            this.toastr.error("An error occured while fetching repository list", "Error");
        },
        complete: ()=>{
          this.refreshRepoListDropdown();
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

  initOnRepoSelection(repoId: number){
    let repoObj : IRepoDetails = this.getRepoFromId(repoId);
    let newRepoContent: IRepoContent = new RepoContent();
    newRepoContent.isFavourite = repoObj.isFavourite;

    this.repoService.getRepoDetails(repoObj.repoOwner, repoObj.repoName).subscribe({
      next: (data: {createdDate: Date, updatedDate: Date, repoLink: string, repoName: string, owner: string})=> {
        newRepoContent.repoName = data.repoName;
        newRepoContent.repoOwner = data.owner;
        newRepoContent.repoUrl = data.repoLink;
        newRepoContent.repoCreationDate = data.createdDate;
        newRepoContent.repoUpdateDate = data.updatedDate;

        this.repoService.getRepoLanguages(repoObj.repoOwner, repoObj.repoName).subscribe({
          next: (data: ILanguageDetails[])=> {
            newRepoContent.repoLanguageList = data;
            if(newRepoContent.repoName  === this.getRepoFromId(this.selectedRepositoryId).repoName) {
              this.currentRepoDetails = newRepoContent;
              //Call child component change only when Repo details were fetched correctly
              this.commitDetailsComp.repositoryDetails = repoObj;
              this.commitGraphComp.repositoryDetails = repoObj;
              
              this.refreshLanguageChart();
            }
    
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

  /*********************************** Event Handlers **********************************/

  repoChangeHandler(value: string){
    let index: number = parseInt(value);
    this.getRepoFromId(index).count += 1;
    this.initOnRepoSelection(this.selectedRepositoryId);
    this.reorderRepoList();
    this.refreshRepoListDropdown();
  }

  logoutHandler(){
     this.repoDbService.persistActivityCount(this.getActivityCount()).subscribe({
      next: (data) => {
        this.authService.logout().subscribe({
          next: (value : {status: string, message: string})=>{
          },
          error: (error)=>{
          }
        });
      },
      error: (error) => {
        if(error !== "suppressed")
          console.error("An error occured while persisting activity count");
        this.authService.logout().subscribe({
          next: (value : {status: string, message: string})=>{
          },
          error: (error)=>{
          }
        })
        
      }
    })
    this.router.navigateByUrl('/login');
  }

  /************************* Property Accessor Functions ****************/

  getUserName(): string {
    return this.authService.getAuthUserName();
  }

  getThemeName(): string {
    return this.themeService.getThemeName();
  }

  getPrefTimeOffset() : string{
    return this.userPrefService.getPreferedTimeOffset();
  }



  /******************************* Utilities ****************************/

  getRepoFromId(repoId: number) {
    let got =  this.repoList.find(obj => repoId == obj.repoId)!;
    return got;
  }

  reorderRepoList(){
    let selectedRepository : IRepoDetails;
    if(this.selectedRepositoryId !== -1){
      selectedRepository = this.getRepoFromId(this.selectedRepositoryId);
    }
    this.repoList.sort(function comparator(a: IRepoDetails,b: IRepoDetails): number { 
      if(a.isFavourite! > b.isFavourite!){
        return -1;
      }
      else if(a.isFavourite! < b.isFavourite!){
        return 1;
      }
      if(a.count > b.count){
        return -1;
      }
      else if(a.count < b.count){
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
    if(this.selectedRepositoryId !== -1)
      this.selectedRepositoryId = selectedRepository!.repoId;

  }

  // Bootstrap selectpicker need to be refreshed when changes are made from code
  refreshRepoListDropdown(){
    setTimeout(() => {
      $(this.repoDropDown.nativeElement).selectpicker('refresh');
    });
  }

  refreshLanguageChart(): void {
    let repoLanguageList = this.currentRepoDetails.repoLanguageList;
    if(repoLanguageList === undefined) {
      repoLanguageList = [];
    }
    let languageLabel = repoLanguageList?.map((x)=> x.language);
    let languageData = repoLanguageList?.map((x)=> x.bytesOfCode);
    this.chartData = {
      labels: languageLabel,
      datasets: [{
        label: 'Number of bytes used: ',
        data: languageData,
        hoverOffset: 4,
        backgroundColor: this.chartBackgroundColors,
      }]

    }
  }

  getActivityCount() {
    return this.repoList.reduce((total: {repoId: number, count: number}[], currentValue: IRepoDetails, currentIndex: number)=>{
      if(currentValue.count > 0) {
        total.push({repoId: currentValue.repoId, count: currentValue.count});
      }
      return total;
    }, []);
  }

  /************************ Theme Change Functions ******************************/
  changeGraphColor(color: ITheme){
    this.chartOptions!.plugins!.legend!.labels!.color = color.graphLineColor;
    this.chartBackgroundColors = color.languageGraphColors;
    this.refreshLanguageChart();
  }

  changeToNextTheme() {
    this.themeService.setNextTheme();
  }

  changeToPreviousTheme() {
    this.themeService.setPreviousTheme();
  }

  /************************* Favorite Change Functions ************************/
  favouriteChangeHandler() {
    if(this.currentRepoDetails.isFavourite === true) {
      this.unfavourite();
    }
    else{
      this.changeFavourite();
    }
  }

  //Get favourite repository from local 'this.repoList' var
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
    let newFavouriteRepo = this.getRepoFromId(this.selectedRepositoryId);
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
      this.repoDbService.setFavourite(newFavouriteRepo.repoId!).subscribe({
        next: (data: {status: string, message: string})=>{
          if(data.status === "Success"){
            if(oldFavouriteRepo !== undefined)
              oldFavouriteRepo!.isFavourite = false;
            // this.repoIsFavourite = true;
            this.currentRepoDetails.isFavourite = true;
            this.repoList.find((obj)=>obj.repoName === newFavouriteRepo.repoName)!.isFavourite = true;
            this.reorderRepoList();
            this.refreshRepoListDropdown();
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
    let favouriteRepo = this.getRepoFromId(this.selectedRepositoryId);
    let heading = "Confirmation";
    let body = `Are you sure you will like to remove ${favouriteRepo.repoName} as the favourite repository ?`;

    if((await this.popUp.showPrompt(heading, body)) === true) {
      this.repoDbService.removeFavourite(favouriteRepo.repoId!).subscribe({
        next: (data: {status: string, message: string})=>{
          if(data.status === "Success"){
            // this.repoIsFavourite = false;
            this.currentRepoDetails.isFavourite = false;
            this.repoList.find((obj)=>obj.repoName === favouriteRepo.repoName)!.isFavourite = false;
            this.reorderRepoList();
            this.refreshRepoListDropdown();
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

  /******************* Screen refresh on height change ********************************/
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

}
