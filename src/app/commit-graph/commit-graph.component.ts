import { Component, ElementRef, Input, OnInit, ViewChild, SimpleChanges } from '@angular/core';
import { ChartOptions, ChartData, ChartType  } from 'chart.js';

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
  repositoryName: string = '';

  monthList?: string[];
  
  monthDropDownValue: string = '';

  barChartLabels?: string[];

  barChartValues?: number[];




  barChartType: ChartType = 'line'

  barChartData?: ChartData<'line'> = undefined;
  
  chartOptions: ChartOptions = {
    responsive: true,
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

  constructor() { }

  ngOnInit(): void {
    //this.initAfterRepoSelection();
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes.repositoryName != null){
      this.initAfterRepoSelection();
    }
  }

  initAfterRepoSelection(){
    //Read this.repositoryName and call api to get month list
    this.monthList = ["June, 2018", "May, 2018", "April, 2018", "March, 2018"];
    this.monthDropDownValue = this.monthList[0];
    this.refreshDropdown();
    this.refreshGraph(this.monthDropDownValue);
  }

  refreshDropdown(){
    // Have to give a delay because of 
    setTimeout(() => {
      $(this.monthDropDown.nativeElement).selectpicker('refresh')
    });
  }



  refreshGraph(value: string): void{
    console.log("Called refresh Graph", value);
    //Read barcharlabel and barchartvalues from api for value timee interval and use them to set barChartdata
    this.barChartLabels = Array.from({length: 30}, (_, i) => (i + 1).toString());
    this.barChartValues = Array.from({length: 30}, (_, i) => Math.floor(Math.random()*100));
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
