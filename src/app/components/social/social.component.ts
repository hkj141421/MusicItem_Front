import { Component, OnInit } from '@angular/core';
import { trackDetail } from 'src/app/class/trackDetail';
import { TrackService } from 'src/app/services/track.service';
import { track } from 'src/app/class/track';
import { UploadFile, UploadXHRArgs, NzMessageService } from 'ng-zorro-antd';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { user } from 'src/app/class/user';

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.css']
})
export class SocialComponent implements OnInit {

  userinfo:user;

  tracktext:any="";

  pagenum:number=1;

  loadstatus:boolean=false;

  trackpulishstatus:boolean=true;

  trackArray:Array<trackDetail>=new Array();

  imagesList:string[]=[];

  socialData:any;
  
  constructor(private trackService:TrackService,private commonService:CommonService,private msg:NzMessageService,private router:Router,private activRouter:ActivatedRoute) { }

  ngOnInit() {
    this.activRouter.data.subscribe((data)=>{
      this.userinfo=JSON.parse(data.MymusicResolve);
      this.loadSocialData(this.userinfo.userid);
    })
    this.commonService.UserInfo.subscribe((data)=>{
      if(data==null)
      {
        this.router.navigateByUrl("/nologin");
      }else{
        this.userinfo=data;
        this.loadSocialData(this.userinfo.userid);
      }
    })
    
    this.loadTrack(1);
  }

  showcomment(index){
    this.trackArray[index].commentWindowStatus=!this.trackArray[index].commentWindowStatus;
  }

  publishTrack(){
    var t=new track();
    t.textcontent=this.tracktext;
    this.trackpulishstatus=false;
    if(this.imagesList.length==3)
    {
      t.imgcontent1=this.imagesList[0];
      t.imgcontent2=this.imagesList[1];
      t.imgcontent3=this.imagesList[2];
    }
    else if(this.imagesList.length==2)
    {
      t.imgcontent1=this.imagesList[0];
      t.imgcontent2=this.imagesList[1];
    }
    else{
      t.imgcontent1=this.imagesList[0];
    }
    this.trackService.Addtrack(t).subscribe((data)=>{
          var trackdet=new trackDetail();
          trackdet.trackinfo=data.data;
          trackdet.trackinfo.fabulous=0;
          trackdet.trackinfo.userid=Number.parseInt(this.userinfo.userid);
          trackdet.trackinfo.username=this.userinfo.username;
          trackdet.trackinfo.userheadimg=this.userinfo.userheadimg;
          this.socialData.trackcount=Number.parseInt(this.socialData.trackcount)+1;
          this.trackArray.splice(0,0,trackdet)
          this.tracktext='';
          this.trackpulishstatus=true;
          this.imagesList=[];
    },(err)=>{
      console.log(err);
    })
    
  }

  loadSocialData(userid){
      this.trackService.countSocialData(userid).subscribe((data)=>{
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

  beforeUpload=():boolean=>{

    if(this.imagesList.length>2){
      this.msg.info("最多只能发布三张图片哦！");
      return false;
    }
    else{
      return true;
    }
    
  }

  customUploadRequest=(item:UploadXHRArgs)=>{

      return this.commonService.handleUploadTrackImage(item.file).subscribe((data)=>{
          this.imagesList.push(data.data);
      },(err)=>{
        console.log(err);
      })
  }

  deleteImg(i)
  {
      this.commonService.deleteUploadFile(this.imagesList[i]).subscribe((data)=>{
            if(data.status=="200"){
              this.imagesList.splice(i,1);
            }
            else{
              console.log(data)
            }
      },(err)=>{
        console.log(err)
      })
  }

  follwe(i){
    this.trackService.Addfollow(this.trackArray[i].trackinfo.userid).subscribe((data)=>{
      if(data.status=="200"){
        this.trackArray[i].trackinfo.isfans='true';
        this.socialData.followcount=Number.parseInt(this.socialData.followcount)+1;
      }
      else console.log(data);
    },(err)=>{console.log(err);})
  }

  cancalfollwe(i){
    this.trackService.deletefollow(this.trackArray[i].trackinfo.userid).subscribe((data)=>{
      if(data.status=="200"){
        this.trackArray[i].trackinfo.isfans='false';
        this.socialData.followcount=Number.parseInt(this.socialData.followcount)-1;
      }
      else console.log(data);
    },(err)=>{console.log(err);})
  }

  loadTrack(page:number)
  {
      this.trackService.loadTrackPage(page).subscribe((data)=>{
          if(data.status=="200"){
            for(var i=0;i<data.data.length;i++)
            {
              var t=new trackDetail();
              t.trackinfo=data.data[i];
              this.trackArray.push(t);
            }   
          }else{
            console.log(data);
          }
            this.loadstatus=false;
      },(err)=>{
        console.log(err);
        this.loadstatus=false;
      })
  }

  load(){
    this.pagenum++;
    this.loadstatus=true;
    this.loadTrack(this.pagenum);
  }

  liketrack(i){
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

}
