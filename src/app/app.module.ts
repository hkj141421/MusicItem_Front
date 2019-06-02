import { BrowserModule } from '@angular/platform-browser';
import { NgModule,Renderer2,ElementRef } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AudioComponent } from './components/audio/audio.component';
import { HttpClient ,HttpParams,HttpClientModule} from '@angular/common/http'; 
import { MusicService } from '../app/services/music.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { MymusicComponent } from './components/mymusic/mymusic.component';
import { TestComponent } from './components/test/test.component';
import { CreateSheetComponent } from './components/create-sheet/create-sheet.component';
import { PersonalCenterComponent } from './components/personal-center/personal-center.component';
import { PersonalInfoComponent } from './components/personal-info/personal-info.component';
import { PersonalAccountComponent } from './components/personal-account/personal-account.component';
import { SheetdetailComponent } from './components/sheetdetail/sheetdetail.component';
import { CommentsComponent } from './components/comments/comments.component';
import { MusicInfoComponent } from './components/music-info/music-info.component';
import { SocialComponent } from './components/social/social.component';
import { RegisterComponent } from './components/register/register.component';
import { CommonService } from '../app/services/common.service';
import { NologinComponent } from './components/nologin/nologin.component';
import { CollectMusicComponent } from './components/collect-music/collect-music.component';
import { AllSheetComponent } from './components/all-sheet/all-sheet.component';
import { SearchComponent } from './components/search/search.component';
import { SingerinfoComponent } from './components/singerinfo/singerinfo.component';
import { MusicresultComponent } from './components/musicresult/musicresult.component';
import { SingerresultComponent } from './components/singerresult/singerresult.component';
import { UserresultComponent } from './components/userresult/userresult.component';
import { SheetresultComponent } from './components/sheetresult/sheetresult.component';
import { BandsComponent } from './components/bands/bands.component';
import { BandinfoComponent } from './components/bandinfo/bandinfo.component';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { PersonalTrackComponent } from './components/personal-track/personal-track.component';
import { SocialNoLoginComponent } from './components/social-no-login/social-no-login.component';
import { ManageComponent } from './backstage/components/manage/manage.component';
import { OverviewComponent } from './backstage/components/overview/overview.component';
import { SelectMusicComponent } from './backstage/components/select-music/select-music.component';
import { SelectSingerComponent } from './backstage/components/select-singer/select-singer.component';
import { SelectSheetComponent } from './backstage/components/select-sheet/select-sheet.component';
import { SelectUserComponent } from './backstage/components/select-user/select-user.component';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    AudioComponent,
    NavbarComponent,
    HomeComponent,
    MymusicComponent,
    TestComponent,
    CreateSheetComponent,
    PersonalCenterComponent,
    PersonalInfoComponent,
    PersonalAccountComponent,
    SheetdetailComponent,
    CommentsComponent,
    MusicInfoComponent,
    SocialComponent,
    RegisterComponent,
    NologinComponent,
    CollectMusicComponent,
    AllSheetComponent,
    SearchComponent,
    SingerinfoComponent,
    MusicresultComponent,
    SingerresultComponent,
    UserresultComponent,
    SheetresultComponent,
    BandsComponent,
    BandinfoComponent,
    UserInfoComponent,
    PersonalTrackComponent,
    SocialNoLoginComponent,
    ManageComponent,
    OverviewComponent,
    SelectMusicComponent,
    SelectSingerComponent,
    SelectSheetComponent,
    SelectUserComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgZorroAntdModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule
  ],
  providers: [MusicService,CommonService,HttpClient, { provide: NZ_I18N, useValue: zh_CN }],
  bootstrap: [AppComponent]
})
export class AppModule { }
