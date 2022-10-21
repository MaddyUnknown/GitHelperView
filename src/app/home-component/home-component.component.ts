import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'home-component',
  templateUrl: './home-component.component.html',
  styleUrls: ['./home-component.component.css']
})
export class HomeComponentComponent implements OnInit {

  selectedRepository: string = '-1';

  repoList: any[] = [
    {name: 'Tkinter-Calculator', url: 'https://github.com/unknown/tkinter-calculatort'},
    {name: 'HiveMind', url: 'https://github.com/unknown/hivemindp'},
    {name: 'BrainBoost', url: 'https://github.com/unknown/hivemindl'},
    {name: 'Serco', url: 'https://github.com/unknown/hivemindi'},
    {name: 'Parasetaniousis', url: 'https://github.com/unknown/hivemindn'},
    {name: 'Counter Strik: GO', url: 'https://github.com/unknown/hivemindk'}

  ]
  // repoList: any[] = [];
  constructor() { }

  ngOnInit(): void {
  }

}
