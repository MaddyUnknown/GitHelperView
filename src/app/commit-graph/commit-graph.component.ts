import { Component, ElementRef, Input, OnInit, ViewChild, SimpleChanges } from '@angular/core';
import { ChartOptions, ChartData, ChartType  } from 'chart.js';
import { DEFAULT_REPO_DETAILS, IRepoDetails, RepoService } from '../service/repo.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';  

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
  
  @Input()
  repositoryDetails: IRepoDetails = DEFAULT_REPO_DETAILS;

  monthYearList?: {month: string, year: string}[];
  
  monthDropDownValue: string = '';

  barChartLabels?: string[];

  barChartValues?: number[];




  barChartType: ChartType = 'line'

  barChartData?: ChartData<'line'> = undefined;
  
  chartOptions: ChartOptions = {
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

  constructor(private repoService: RepoService, private spinner: NgxSpinnerService, private toastr: ToastrService) { }

  ngOnInit(): void {
    //this.initAfterRepoSelection();
    
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes.repositoryDetails != null && this.repositoryDetails.repoName!=''){
      this.initAfterRepoSelection();
    }
  }

  initAfterRepoSelection(){
    //Read this.repositoryDetails and call api to get month list

    this.repoService.getMonthYearListForRepo(this.repositoryDetails.owner, this.repositoryDetails.repoName).subscribe({
      next: (data: {month: string, year: string}[])=>{
        this.monthYearList = data;
        this.refreshDropdown();
        if(this.monthYearList.length !== 0){
          this.monthDropDownValue = JSON.stringify(this.monthYearList[0]);
          this.refreshDropdown();
          this.refreshGraph(this.monthDropDownValue);
        }
      },
      error: (error)=>{
        this.toastr.error("An error occured while fetching Month List", "Error");
      }
  })
  }

  refreshDropdown(){
    // Have to give a delay because of 
    setTimeout(() => {
      $(this.monthDropDown.nativeElement).selectpicker('refresh')
    });
  }



  refreshGraph(value: string): void{
    var periodObj : {month: string, year: string} = JSON.parse(value);
    //Read barcharlabel and barchartvalues from api for value timee interval and use them to set barChartdata
    this.spinner.show("graph-spinner");
    this.repoService.getGraphData(this.repositoryDetails.owner, this.repositoryDetails.repoName, periodObj.month, periodObj.year).subscribe({
      next:(data: {commits: number, day: number}[])=>{
        this.barChartLabels = data.map((value)=>value.day.toString());
        this.barChartValues = data.map((value)=>value.commits);
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
      },
      error:(error)=>{
        this.toastr.error("An Error Occured While fetching Graph Data", "Error");
      },
      complete: ()=>{
        this.spinner.hide("graph-spinner");
      }
    })
  }

  protected getStringFromPeriod(month: string, year: string): string{
    return month+', '+year;
  }



}
