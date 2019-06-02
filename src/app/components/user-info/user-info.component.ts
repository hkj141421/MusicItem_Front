import { Component, OnInit } from '@angular/core';
import { TrackService } from 'src/app/services/track.service';
import { sheet } from 'src/app/class/sheet';
import { user } from 'src/app/class/user';
import { SheetService } from '../../services/sheet.service';
import { StorgeService } from 'src/app/services/storge.service';
import { NzMessageService } from 'ng-zorro-antd';
import { ActivatedRoute, Params } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {

  socialData:any;

  collect:Array<sheet>=new Array();

  create:Array<sheet>=new Array(); //当前页显示的创建歌单

  userinfo:user=new user();

  loginuser:user;

  constructor(private trackService:TrackService,private sheetService:SheetService,private storge:StorgeService,private msg:NzMessageService,private Active:ActivatedRoute,private commonService:CommonService) { }

  ngOnInit() {

    this.Active.params.subscribe((params:Params)=>{
          this.loginuser=JSON.parse(this.storge.getSessionStorage("user"));
          this.loadInfo(params["userid"]);
    })
  }

  loadInfo(userid){
      this.commonService.getUserInfo(userid).subscribe((data)=>{
        if(data.status=="200")
        {
          this.userinfo=data.data;
          this.getsheetinfo();
          this.loadSocialData();
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

  getsheetinfo(){
    this.sheetService.getSheetByuserId(Number.parseInt(this.userinfo.userid),this.userinfo.username).subscribe((data)=>{
      this.create=data.data.self;
      this.collect=data.data.collect;
  },(err)=>{
      console.log(err);
  });
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
