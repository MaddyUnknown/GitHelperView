import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import {Routes, RouterModule} from '@angular/router';

import { AppComponent } from './app.component';
import { CommitUnitComponent } from './commit-unit/commit-unit.component';
import { CommitDetailComponent } from './commit-detail/commit-detail.component';
import { LoginComponentComponent } from './login-component/login-component.component';
import { HomeComponentComponent } from './home-component/home-component.component';
import {RepoService} from './service/repo.service';

import {String2Date} from './custom-pipes/date.transform.pipe';
import { CommitGraphComponent } from './commit-graph/commit-graph.component'; 
import { Json2String, String2Json } from './custom-pipes/json.stringify.pipe';

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
    String2Date,
    Json2String,
    String2Json,
    CommitGraphComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgChartsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [RepoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
