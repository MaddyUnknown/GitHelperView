import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import { AppComponent } from './app.component';
import { CommitUnitComponent } from './commit-unit/commit-unit.component';
import { CommitDetailComponent } from './commit-detail/commit-detail.component';
import { LoginComponentComponent } from './login-component/login-component.component';
import { HomeComponentComponent } from './home-component/home-component.component';

import {String2Date} from './custom-pipes/date.transform.pipe'; 

const appRoutes: Routes = [
  {path: 'login', component: LoginComponentComponent},
  {path: 'home', component: HomeComponentComponent},
  {path: '', redirectTo: 'login', pathMatch: 'full'}
]

@NgModule({
  declarations: [
    AppComponent,
    CommitUnitComponent,
    CommitDetailComponent,
    LoginComponentComponent,
    HomeComponentComponent,
    String2Date
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
