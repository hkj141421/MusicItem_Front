import { Component, OnInit } from '@angular/core';
import { trackDetail } from 'src/app/class/trackDetail';
import { TrackService } from 'src/app/services/track.service';
import { user } from 'src/app/class/user';
import { StorgeService } from 'src/app/services/storge.service';
import { NzMessageService } from 'ng-zorro-antd';
import { ActivatedRoute, Params } from '@angular/router';
import { CommentService } from 'src/app/services/comment.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-personal-track',
  templateUrl: './personal-track.component.html',
  styleUrls: ['./personal-track.component.css']
})
export class PersonalTrackComponent implements OnInit {

  trackArray:Array<trackDetail>=new Array();

  loadstatus:boolean=true;

  pagenum:number=0;

  userinfo:user=new user();

  loginuser:user;

  socialData:any;

  constructor(private trackService:TrackService,private storge:StorgeService,private msg:NzMessageService,private active:ActivatedRoute,private commonService:CommonService) { }

  ngOnInit() {
    this.active.params.subscribe((params:Params)=>{
        this.loadInfo(params["id"]);
        this.loginuser=JSON.parse(this.storge.getSessionStorage("user"));
    })
  }

  
  liketrack(i){
    if(this.storge.getSessionStorage("user"))
    {
      var fabulous=0;
      if(!this.trackArray[i].isfabulous)
      {
        fabulous=this.trackArray[i].trackinfo.fabulous+1;
        this.trackArray[i].isfabulous=true;
      }
      else
      {
        fabulous=this.trackArray[i].trackinfo.fabulous-1;
        this.trackArray[i].isfabulous=false;
      }
      this.trackService.updateTrackFabulous(fabulous,this.trackArray[i].trackinfo.trackid).subscribe((data)=>{
        this.trackArray[i].trackinfo.fabulous=fabulous;
      },(err)=>{
        console.log(err);
        this.trackArray[i].isfabulous=!this.trackArray[i].isfabulous
      })
    }
    else this.msg.info("请登录后再点赞");

  }
  load(){
    this.pagenum++;
    this.loadTrack(this.pagenum);
  }

  loadTrack(page:number)
  {
      this.trackService.loadPersonalTrackPage(page,this.userinfo.userid).subscribe((data)=>{
          if(data.status=="200"){
            for(var i=0;i<data.data.length;i++)
            {
              var t=new trackDetail();
              t.trackinfo=data.data[i];
              this.trackArray.push(t);
            }   
            if(data.data.length==0)this.loadstatus=false;
          }else{
            console.log(data);
          }
      },(err)=>{
        console.log(err);
      })
  }

  showcomment(index){
    this.trackArray[index].commentWindowStatus=!this.trackArray[index].commentWindowStatus;
  }

  loadInfo(userid){
    this.commonService.getUserInfo(userid).subscribe((data)=>{
      if(data.status=="200")
      {
        this.userinfo=data.data;
        this.loadSocialData();
        this.load();
      }
      else{
        console.log(data);
      }
    },(err)=>{
      console.log(err);
    })

}

loadSocialData(){
  this.trackService.countSocialData(this.userinfo.userid).subscribe((data)=>{
    if(data.status=="200")
    {
      this.socialData=data.data;
    }
    else{
      console.log(data);
    }
  },(err)=>{
    console.log(err);
  })
}

follow()
{
  if(this.storge.getSessionStorage("user"))
  {
    if(this.userinfo.isfans)
    {
      this.cancalIdol();
    }
    else {
      this.Idol();
    }
  }
  else{
      this.msg.info("请登录后关注用户");
  }
}

Idol(){
  this.trackService.Addfollow(this.userinfo.userid).subscribe((data)=>{
    if(data.status=="200"){
      this.userinfo.isfans=true;
      this.socialData.followcount=Number.parseInt(this.socialData.followcount)+1;
    }
    else console.log(data);
  },(err)=>{console.log(err);})
}

cancalIdol(){
  this.trackService.deletefollow(this.userinfo.userid).subscribe((data)=>{
    if(data.status=="200"){
      this.userinfo.isfans=false;
      this.socialData.followcount=Number.parseInt(this.socialData.followcount)-1;
    }
    else console.log(data);
  },(err)=>{console.log(err);})
}

}
