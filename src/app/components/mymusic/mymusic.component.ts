import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SheetService } from '../../services/sheet.service';
import { sheet } from '../../class/sheet';
import { ActivatedRoute,Params, Router, ActivatedRouteSnapshot } from '@angular/router';
import { user } from 'src/app/class/user';
import { CommonService } from 'src/app/services/common.service';
import { TrackService } from 'src/app/services/track.service';

@Component({
  selector: 'app-mymusic',
  templateUrl: './mymusic.component.html',
  styleUrls: ['./mymusic.component.css']
})
export class MymusicComponent implements OnInit {

  introduce:any="这个人很神秘，没有留下介绍呢!";

  createList:Array<sheet>=[];//用户所有的创建歌单

  create:Array<sheet>; //当前页显示的创建歌单

  collectList:Array<sheet>=[];//用户所有的收藏歌单

  collect:Array<sheet>; //当前页显示的收藏歌单

  collectindex:number=1; //收藏歌单的当前页数

  createindex:number=1;  //创建歌单的当前页数

  size:number=10;// 分页的尺寸

  visible:boolean=false;//新建歌单左侧抽屉的可见性

  userinfo:user=new user();

  userId:Number;

  social:any;

  constructor(private sheetService:SheetService,private router:Router,private builder:FormBuilder,private com:CommonService,private ActiveRouter:ActivatedRoute,private trackService:TrackService) {
    
   }

   open(){
     this.visible=true;
   }
   close(){
     this.visible=false;
   }

  
  ngOnInit() {
    
    this.ActiveRouter.data.subscribe((data:any)=>{
      this.userinfo=JSON.parse(data.MymusicResolve);
      this.getsheetinfo();
      this.loadSocialData(this.userinfo.userid)
    })

    this.com.UserInfo.subscribe((data)=>{
        if(data==null)
        {
          this.router.navigateByUrl("/nologin");
        }else{
          this.userinfo=data;
          this.getsheetinfo();
          this.loadSocialData(this.userinfo.userid)
        }
      })
  }

  loadSocialData(userid){
    this.trackService.countSocialData(userid).subscribe((data)=>{
      if(data.status=="200")
      {
        this.social=data.data;
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
        this.createList=data.data.self;
        this.collectList=data.data.collect;
        this.collect=this.collectList.slice(0,this.size);
        this.create=this.createList.slice(0,this.size);
    },(err)=>{
        console.log(err);
    });
  }

  collectpage(){
    this.collect=this.collectList.slice((this.collectindex-1)*this.size,(this.collectindex-1)*this.size+this.size);
  }

  createpage(){
    var start=(this.createindex-1)*this.size;
    var end=(this.createindex-1)*this.size+this.size;
    this.create=this.createList.slice(start,end);
  }

  addSheet(event:sheet){
    this.createList.push(event);
    this.createpage();
  }
  
}
