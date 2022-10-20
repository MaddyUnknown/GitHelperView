import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'home-component',
  templateUrl: './home-component.component.html',
  styleUrls: ['./home-component.component.css']
})
export class HomeComponentComponent implements OnInit {

  repoList: any[] = [
    {name: 'Tkinter-Calculator', url: 'https://github.com/unknown/tkinter-calculator'},
    {name: 'HiveMind', url: 'https://github.com/unknown/hivemind'},
    {name: 'HiveMind', url: 'https://github.com/unknown/hivemind'},
    {name: 'HiveMind', url: 'https://github.com/unknown/hivemind'},
    {name: 'HiveMind', url: 'https://github.com/unknown/hivemind'},
    {name: 'HiveMind', url: 'https://github.com/unknown/hivemind'}

  ]
  // repoList: any[] = [];
  constructor() { }

  ngOnInit(): void {
  }

}
