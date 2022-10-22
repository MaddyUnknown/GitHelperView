import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { DEFAULT_REPO_DETAILS, ILanguageDetails, IRepoDetails, RepoService } from '../service/repo.service';

@Component({
  selector: 'home-component',
  templateUrl: './home-component.component.html',
  styleUrls: ['./home-component.component.css']
})
export class HomeComponentComponent implements OnInit {

  @ViewChild('repoDetailsView') repoDetailsView:ElementRef; 
  @ViewChild('commitDetailsView') commitDetailsView:ElementRef; 

  selectedRepositoryDetails: string = JSON.stringify(DEFAULT_REPO_DETAILS);

  repoList?: IRepoDetails[];

  userAvatarUrl?: string;

  numOfContributers?: number;

  languagesList?: ILanguageDetails[];

  //Chart Variable Declarations
  chartType : ChartType = 'pie';
  
  chartData?: ChartData<ChartType>;

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

  constructor(private repoService : RepoService) { }

  ngOnInit(): void {
      this.repoService.getRepoListAndUserDetails().subscribe((data: {userAvatarUrl: string, repoList: IRepoDetails[] })=>{
        this.repoList = data.repoList;
        this.userAvatarUrl = data.userAvatarUrl;
      })
  }

  initOnRepoSelection(value: string){
    let repoObj : IRepoDetails = JSON.parse(value);
    this.repoService.getRepoInformation(repoObj.owner, repoObj.repoName).subscribe((data: {numOfColaborators: number, languageList: ILanguageDetails[]})=> {
      this.numOfContributers = data.numOfColaborators;
      this.languagesList = data.languageList;

      let label = this.languagesList?.map((x)=> x.language);
      let labelData: any = this.languagesList?.map((x)=> x.bytesOfCode);
      this.chartData = {
        labels: label,
        datasets: [{
          label: 'Number of bytes used: ',
          data: labelData,
          hoverOffset: 4
        }]

      }
    });
  }

  getWindowWidth(){
    return window.innerWidth;
  }

  /*
    Needed to refresh the view everytime window size changes
    Why needed?: Everytime the screens aspect ratio changed drastically height of 'commitDetailsView' and 'repoDetailsView' were not the same (for devices greater than xl)
    Fix: A programatic approch is taken where the height of repoDetailsView is copied to height of commitDetailsView for xl devices.
    [style.height.px]="(getWindowWidth() > 992)? repoDetailsView.offsetHeight:  'auto'" is used in template and to trigger this hostlistener is required.
  */
  @HostListener('window:resize', ['$event'])
    onResize(event: any) {
  }


}
