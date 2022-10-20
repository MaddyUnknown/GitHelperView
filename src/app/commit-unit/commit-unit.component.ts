import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-commit-unit',
  templateUrl: './commit-unit.component.html',
  styleUrls: ['./commit-unit.component.css']
})
export class CommitUnitComponent {

  @Input()
  commitDateTime : Date = new Date('2022-09-27T05:57:47Z');

  @Input()
  commitMessage : string = '';

  @Input()
  commitAuthorName: string = '';


  constructor() { }

}
