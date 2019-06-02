import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MymusicComponent } from './components/mymusic/mymusic.component';
import { HomeComponent } from './components/home/home.component';
import { PersonalCenterComponent } from '../app/components/personal-center/personal-center.component'
import { SheetdetailComponent } from '../app/components/sheetdetail/sheetdetail.component'
import { MusicInfoComponent } from '../app/components/music-info/music-info.component'
import { RegisterComponent } from '../app/components/register/register.component'
import { loginGuard } from '../app/services/loginGuard';
import { socialGuard } from '../app/services/socialGuard';
import { MymusicResolve } from '../app/services/MymusicResolve';
import { NologinComponent } from '../app/components/nologin/nologin.component'
import { SocialNoLoginComponent } from '../app/components/social-no-login/social-no-login.component'
import { SocialComponent } from '../app/components/social/social.component'
import { AllSheetComponent } from '../app/components/all-sheet/all-sheet.component'
import { SearchComponent } from '../app/components/search/search.component';
import { BandinfoComponent } from '../app/components/bandinfo/bandinfo.component';
import { BandsComponent } from '../app/components/bands/bands.component';
import { UserInfoComponent } from '../app/components/user-info/user-info.component';
import { PersonalTrackComponent } from '../app/components/personal-track/personal-track.component';
import { SingerinfoComponent } from '../app/components/singerinfo/singerinfo.component';
import { ManageComponent } from '../app/backstage/components/manage/manage.component'
import { SelectMusicComponent } from '../app/backstage/components/select-music/select-music.component'
import { SelectSheetComponent } from '../app/backstage/components/select-sheet/select-sheet.component'
import { SelectSingerComponent } from '../app/backstage/components/select-singer/select-singer.component'
import { OverviewComponent } from '../app/backstage/components/overview/overview.component'
import { SelectUserComponent } from '../app/backstage/components/select-user/select-user.component'

const routes: Routes = [
  {path: 'home',component:HomeComponent},
  {path: 'mymusic',component: MymusicComponent,canActivate:[loginGuard],resolve:{MymusicResolve}},
  {path: 'setting/:id',component:PersonalCenterComponent,canActivate:[loginGuard]},
  {path: 'sheet/:sheetid',component:SheetdetailComponent},
  {path: 'music/:musicid',component:MusicInfoComponent},
  {path: 'register',component:RegisterComponent},
  {path: 'social',component:SocialComponent,canActivate:[socialGuard],resolve:{MymusicResolve}},
  {path: 'allsheet',component:AllSheetComponent},
  {path: 'search/:key',component:SearchComponent},
  {path: 'band',component:BandsComponent},
  {path: 'bandinfo/:name',component:BandinfoComponent},
  {path: 'userinfo/:userid',component:UserInfoComponent},
  {path: 'track/:id',component:PersonalTrackComponent},
  {path: 'singerinfo/:singerid',component:SingerinfoComponent},
  {path: 'nologin',component:NologinComponent},
  {path: 'socialnologin',component:SocialNoLoginComponent},
  {path: 'backstage', component:ManageComponent,children:[
    {path:'singer',component:SelectSingerComponent},
    {path:'music',component:SelectMusicComponent},
    {path:'sheet',component:SelectSheetComponent},
    {path:'overview',component:OverviewComponent},
    {path:'user',component:SelectUserComponent},
    {path:'',component:OverviewComponent},
  ]},
  {path:'',component:HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[MymusicResolve,loginGuard,socialGuard]
})
export class AppRoutingModule { }
