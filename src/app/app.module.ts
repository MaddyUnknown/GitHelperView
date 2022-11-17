import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import {Routes, RouterModule} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';  
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from "ngx-spinner";

import { AppComponent } from './app.component';
import { CommitUnitComponent } from './commit-unit/commit-unit.component';
import { CommitDetailComponent } from './commit-detail/commit-detail.component';
import { LoginComponentComponent } from './login-component/login-component.component';
import { HomeComponentComponent } from './home-component/home-component.component';
import {RepoService} from './service/repo.service';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import {String2Date} from './custom-pipes/date.transform.pipe';
import { CommitGraphComponent } from './commit-graph/commit-graph.component'; 
import { Json2String, String2Json } from './custom-pipes/json.stringify.pipe';
import { AuthenticationService } from './service/auth.service';
import { AuthGuardService } from './service/auth.guard.service';
import { UserPreferenceService } from './service/user.preference.service';
import { ThemeService } from './service/theme.service';
import { PopUpComponent } from './pop-up/pop-up.component';
import { RepoDbService } from './service/repoDb.service';

const appRoutes: Routes = [
  {path: 'login', component: LoginComponentComponent},
  {path: 'home', component: HomeComponentComponent, canActivate: [AuthGuardService]},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: '**', redirectTo: 'home', pathMatch: 'full'}
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
    CommitGraphComponent,
    PopUpComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    InfiniteScrollModule,
    NgChartsModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    ToastrModule.forRoot({
      positionClass :'toast-top-center'
    }),
    RouterModule.forRoot(appRoutes)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [RepoService, RepoDbService, AuthenticationService, AuthGuardService, UserPreferenceService, ThemeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
