import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ChartOptions, ChartData, ChartType  } from 'chart.js';
import { DEFAULT_REPO_DETAILS, IRepoDetails, RepoService } from '../service/repo.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';  
import { reduce } from 'rxjs';
import { ITheme, ThemeService } from '../service/theme.service';

declare var $: any;

@Component({
  selector: 'commit-graph',
  templateUrl: './commit-graph.component.html',
  styleUrls: ['./commit-graph.component.css']
})
export class CommitGraphComponent implements OnInit {

  @ViewChild('monthDropDown') monthDropDown!: ElementRef;

  @Input()
  graphColor: string = '#1D8F6D';

  spinnerColor: string = 'white';
  
  @Input() set repositoryDetails(value: IRepoDetails) {
    this._repositoryDetails = value;
    this.changeRepo();
  }

  private _repositoryDetails: IRepoDetails = DEFAULT_REPO_DETAILS;

  monthYearList: {month: string, year: string}[];
  
  monthDropDownValue: number = -1;

  monthYearSelected: {month: string, year: string};

  barChartLabels?: string[];

  barChartValues?: number[];

  barChartType: ChartType = 'line'

  barChartData?: ChartData<'line'> = undefined;
  
  chartOptions: any = {
    responsive:true,
    scales: {
      y: {
        display: true,
        grid: {
          display: false
        },
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: "black"
        },
        title: {
          display: true,
          text: 'Number of Commits',
          color: "black"
        },
      },
      x: {
        display: true,
        grid: {
          display: false
        },
        ticks: {
          color: "black"
        },
        title: {
          display: true,
          text: 'Day of the Month',
          color: "black"
        },
      },
    },
  };

  constructor(private repoService: RepoService, private spinner: NgxSpinnerService, private toastr: ToastrService, private themeService: ThemeService) { }

  ngOnInit(): void {
    //this.initAfterRepoSelection();
    this.refreshDropdown();
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

  changeRepo(){
    if(this._repositoryDetails != null && this._repositoryDetails.repoName!=''){
      this.initAfterRepoSelection();
    }
  }

  initAfterRepoSelection(){
    //Read this.repositoryDetails and call api to get month list

    this.repoService.getMonthYearListForRepo(this._repositoryDetails.repoOwner, this._repositoryDetails.repoName).subscribe({
      next: (data: {month: string, year: string}[])=>{
        this.monthYearList = data;
        this.refreshDropdown();
        if(this.monthYearList.length !== 0){
          this.monthDropDownValue = 0;
          this.monthYearSelected = this.monthYearList[0];
          this.refreshDropdown();
          this.refreshGraph('0');
        }
      },
      error: (error)=>{
        if(error !== "suppressed")
          this.toastr.error("An error occured while fetching contribution month list", "Error");
      }
  })
  }

  refreshDropdown(){
    // Have to give a delay because of 
    setTimeout(() => {
      $(this.monthDropDown.nativeElement).selectpicker('refresh')
    });
  }

  changeGraphColor(color: ITheme){
    this.chartOptions.scales!.y!.ticks!.color = color.graphLineColor;
    this.chartOptions.scales!.x!.ticks!.color = color.graphLineColor;
    this.chartOptions.scales!.y!.title!.color = color.graphLineColor;
    this.chartOptions.scales!.x!.title!.color = color.graphLineColor;

    this.spinnerColor = color.spinnerColor;
    this.graphColor = color.commitGraphColor;
    this.refreshChart();
  }



  refreshGraph(index: string): void{
    let currentIndex: number = parseInt(index);
    var periodObj : {month: string, year: string} = this.monthYearList[currentIndex];
    this.spinner.show("graph-spinner");
    //Read barcharlabel and barchartvalues from api for value time interval and use them to set barChartdata
    this.repoService.getGraphData(this._repositoryDetails.repoOwner, this._repositoryDetails.repoName, periodObj.month, periodObj.year).subscribe({
      next:(data: {result: {commits: number, day: number}[], owner: string, repoName: string, month: string, year: string})=>{
        let monhtYearPair : {month: string, year: string} = this.monthYearList[this.monthDropDownValue];
        if(data.owner === this._repositoryDetails.repoOwner && data.repoName === this._repositoryDetails.repoName && data.month === monhtYearPair.month && data.year === monhtYearPair.year){
          this.barChartLabels = data.result.map((value)=>value.day.toString());
          this.barChartValues = data.result.map((value)=>value.commits);
          this.refreshChart();
          this.spinner.hide("graph-spinner");
        }
        else{
          // console.log("Request Dropped");
        }
      },
      error:(error)=>{
        if(error !== "suppressed")
          this.toastr.error("An error occured while fetching number of contributions", "Error");
        this.spinner.hide("graph-spinner");
      },
      complete: ()=>{
      }
    })
  }

  refreshChart(): void {
    if(this.barChartValues !== undefined){
      this.barChartData = {
        labels: this.barChartLabels,
        datasets: [
          {
            label: "No. of Commits",
            data:  this.barChartValues,
            borderColor: [this.graphColor],
            borderWidth: 1.5,
            hoverBackgroundColor: [this.graphColor],
            pointBackgroundColor: [this.graphColor],
            tension: 0.15,
            fill: false
          }
        ]
      };
    }
    
  }

  protected getStringFromPeriod(month: string, year: string): string{
    return month+', '+year;
  }



}
