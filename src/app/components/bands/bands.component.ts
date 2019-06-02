import { Component, OnInit } from '@angular/core';
import { user } from 'src/app/class/user';
import { CommentService } from 'src/app/services/comment.service';
import { CommonService } from 'src/app/services/common.service';
import { music } from 'src/app/class/music';
import { MusicService } from 'src/app/services/music.service';
import { StorgeService } from 'src/app/services/storge.service';

@Component({
  selector: 'app-bands',
  templateUrl: './bands.component.html',
  styleUrls: ['./bands.component.css']
})
export class BandsComponent implements OnInit {

  RecomUser:Array<user>; //推荐关注的用户

  ChineseBandfirst:music; //中文榜第一

  ChineseBand:Array<music>;//中文榜

  EnglishBandfirst:music;//英文榜第一

  EnglishBand:Array<music>;//英文榜

  NewMusicBandfirst:music;//新歌榜第一

  NewMusicBand:Array<music>;//新歌榜

  GlobalBandfirst:music;//全球榜第一

  GlobalBand:Array<music>;//全球榜

  constructor(private com:CommonService,private musicService:MusicService,private storge:StorgeService) { }

  ngOnInit() {
    this.getRecomUser();
    this.getChineseBand();
    this.getEnglishBand();
    this.getGlobalBand();
    this.getNewMusicBand();
  }

  getRecomUser()
  {
      var user=JSON.parse(this.storge.getSessionStorage("user"));
      this.com.getRecommenduser(user?user.userid:null).subscribe((data)=>{
        if(data.status=="200"){this.RecomUser=data.data;}
        else console.log(data);
      },(err)=>{
          console.log(err);
      })
  }

  getChineseBand()
  {
      this.musicService.getBandList(1,7,'chinese').subscribe((data)=>{
          if(data.status=="200")
          {
            this.ChineseBandfirst=data.data[0];
            this.ChineseBand=data.data.filter((e,i)=>{return i!=0;});
          }
          else {console.log(data);}
      },(err)=>{
        console.log(err);
      })
  }

  getEnglishBand()
  {
    this.musicService.getBandList(1,7,'english').subscribe((data)=>{
      if(data.status=="200")
      {
        this.EnglishBandfirst=data.data[0];
        this.EnglishBand=data.data.filter((e,i)=>{return i!=0;});
      }
      else {console.log(data);}
      },(err)=>{
        console.log(err);
      })
  }

  getNewMusicBand()
  {
    this.musicService.getBandList(1,7,'newmusic').subscribe((data)=>{
      if(data.status=="200")
      {
        this.NewMusicBandfirst=data.data[0];
        this.NewMusicBand=data.data.filter((e,i)=>{return i!=0;});
      }
      else {console.log(data);}
      },(err)=>{
        console.log(err);
      })
  }

  getGlobalBand()
  {
    this.musicService.getBandList(1,7,'global').subscribe((data)=>{
      if(data.status=="200")
      {
        this.GlobalBandfirst=data.data[0];
        this.GlobalBand=data.data.filter((e,i)=>{return i!=0;});
      }
      else {console.log(data);}
      },(err)=>{
        console.log(err);
      })
  }
}
