import { Component } from '@angular/core';
import { ThemeService } from './service/theme.service'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'GitHelper';

  constructor(private themeService: ThemeService) {}
}
