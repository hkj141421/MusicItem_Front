import { Component, OnInit } from '@angular/core';
import { TrackService } from 'src/app/services/track.service';
import { user } from 'src/app/class/user';
import { CommonService } from 'src/app/services/common.service';
import { StorgeService } from 'src/app/services/storge.service';
import { SheetService } from 'src/app/services/sheet.service';
import { MusicService } from 'src/app/services/music.service';
import { sheet } from 'src/app/class/sheet';
import { music } from 'src/app/class/music';
import { NzMessageService } from 'ng-zorro-antd';
import { SingerService } from 'src/app/services/singer.service';
import { singer } from 'src/app/class/singer';
import { GlobalService } from 'src/app/services/Global.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

 /**热门推荐歌单数组 */
  Sheetlist:Array<sheet>;
  /**华语音乐数组 */
  Chinalist:Array<sheet>;
  /**流行音乐数组 */
  Currentlist:Array<sheet>;
  /**摇滚音乐数组 */
  Rocklist:Array<sheet>;
  /**民谣音乐数组 */
  poplist:Array<sheet>;
  /**新歌上架数组 */
  newMusicList:Array<music>=[];
  /**排行榜数组 */
  BandList:Array<music>=[];
  /**用户信息 */
  user:user;

  socialData:any;//社交状态

  newMusicPagenum:number=1;//新歌的页数

  /**推荐歌手信息 */
  SingerList:Array<singer>;
  /**随机推荐信息 */  
  rondomList:Array<music>=[]

  globalBandList:Array<any>=[];

  newBandList:Array<any>=[];

  constructor(private trackService:TrackService,private com:CommonService,private storge:StorgeService,private sheetService:SheetService,private musicService:MusicService,private msg:NzMessageService,private singerService:SingerService,private globalService:GlobalService) { }

  ngOnInit() {
    this.user=JSON.parse(this.storge.getSessionStorage("user"));
    
    if(this.user)
    {
      this.loadSocialData(this.user.userid);
    }
    this.com.UserInfo.subscribe((data)=>{
      this.user=data;
      if(this.user)
      {
        this.loadSocialData(this.user.userid);
      }
      else this.socialData=null;
    })
    this.loadSheetData(null,1,8);
    this.loadMusicData();
    this.loadBand();
    this.loadRecommendMusic();
    this.loadSinger();
  }


  loadSocialData(userid){
    this.trackService.countSocialData(userid).subscribe((data)=>{
      if(data.status=="200")
      {
        this.socialData=data.data;
      }
      else{
        this.user=null;
        this.storge.removeSessionStorage("user");
        console.log(data);
      }
    },(err)=>{
      this.user=null;
        this.storge.removeSessionStorage("user");
      console.log(err);
    })
  }

  loadSheetData(type:string,pagenum,size){
    if(type)
    {
        this.sheetService.getSheetBytype(type,pagenum,size).subscribe((data)=>{
          if(data.status=='200')
          {
            if(type=='华语') this.Chinalist=data.data;
            else if(type=='流行')this.Currentlist=data.data;
            else if(type=='摇滚')this.Rocklist=data.data;
            else if(type=='民谣')this.poplist=data.data;      
          }
          else{
            console.log(data);
          }
        },(err)=>{
          console.log(err);
        })
    }
    else 
    {
      this.sheetService.getRecommendSheet(pagenum,size).subscribe((data)=>{
        if(data.status=='200')
        {
          this.Sheetlist=data.data;
        }
        else{
          console.log(data);
        }
      },(err)=>{
        console.log(err);
      })
    }
  }

  loadMusicData(){
      this.musicService.getTheNewestMusic(this.newMusicPagenum,4).subscribe((data)=>{
        if(data.status=='200')
        {
          this.newMusicList=data.data;
        }
        else{
          console.log(data);
        }
      },(err)=>{
        console.log(err);
      })
  }

  loadData(type){
    if(type=='推荐')
    {
      this.loadSheetData(null,1,8);
    }
    else
    {
      this.loadSheetData(type,1,8);
    }
    
  }

  nextpage()
  {
    this.newMusicPagenum++;
    this.loadMusicData();
  }

  lastpage()
  { 
    this.newMusicPagenum--;
    if(this.newMusicPagenum>0)
    {
      this.loadMusicData();
    }
    else
    {
      this.newMusicPagenum=1;
      this.msg.info("已到达第一页，向前翻页了!");
    }
  }

  loadBand()
  {
    this.musicService.getBandList(1,10,'newmusic').subscribe((data)=>{
      if(data.status=='200')
      {
        this.newBandList=data.data;
      }
      else
      {
        console.log(data);
      }  
    },(err)=>{
      console.log(err);
    })

    this.musicService.getBandList(1,10,'global').subscribe((data)=>{
          if(data.status=='200')
          {
            this.globalBandList=data.data;
          }
          else
          {
            console.log(data);
          }
      },(err)=>{
          console.log(err);
      })
    }

    addToaudiowait(i,t)
    {
      var arr=new Array<music>();
      if(t=="new")arr.push(this.newBandList[i]);
      else arr.push(this.globalBandList[i]);
      this.globalService.sendMusicToAudioWait(arr);
    }
    addToaudio(i,t)
    {
      var arr=new Array<music>();
      if(t=="new")arr.push(this.newBandList[i]);
      else arr.push(this.globalBandList[i]);
      this.globalService.sendMusicToAudio(arr);
    }
    addToSheet(i)
    {
      this.globalService.sendCollectMusic(i);
    }

    loadRecommendMusic(){
        var musicpreference=null;
        if(this.user)
        {
          musicpreference=this.user.musicpreference;
        }
        this.musicService.getRecommendMusic(musicpreference).subscribe((data)=>{
          if(data.status=='200')
          {
            this.rondomList=data.data
          }
          else{
            console.log(data);
          }
        },(err)=>{
          console.log(err);
        })
    }

    loadSinger(){
      this.singerService.loadRandomSinger(4).subscribe((data)=>{
        if(data.status=='200')
        {
          this.SingerList=data.data;
        }
        else{
          console.log(data);
        }
      },(err)=>{
        console.log(err);
      })
    }
}
