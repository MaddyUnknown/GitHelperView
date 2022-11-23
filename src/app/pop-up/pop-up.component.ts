import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { firstValueFrom, Observable, Subject } from 'rxjs';

@Component({
  selector: 'pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.css']
})
export class PopUpComponent implements OnInit {

  heading: string;

  body: string;

  valueChange : Subject<boolean>;

  @ViewChild('popUp') popUp : ElementRef;

  callbackFunction: Function;

  constructor() { 
    //this.hide();
  }

  ngOnInit(): void {
  }

  async showPrompt(heading: string, body: string) : Promise<boolean> {
    this.valueChange = new Subject<boolean>;
    this.heading = heading;
    this.body = body;
    this.show();
    let value : boolean = await firstValueFrom(this.valueChange);
    this.valueChange.complete();
    return value;
  } 

  success(){
    this.hide();
    this.valueChange.next(true);
  }

  failure(){
    this.hide();
    this.valueChange.next(false);
  }

  hide(){
    this.popUp.nativeElement.classList.add("d-none");
    this.popUp.nativeElement.classList.remove("d-flex");
  }

  show(){
    this.popUp.nativeElement.classList.add("d-flex");
    this.popUp.nativeElement.classList.remove("d-none");
  }

}
