import { Component, OnInit } from '@angular/core';
import { music } from 'src/app/class/music';
import { SheetService } from 'src/app/services/sheet.service';
import { sheet } from 'src/app/class/sheet';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { user } from 'src/app/class/user';
import { StorgeService } from 'src/app/services/storge.service';
import { MusicService } from 'src/app/services/music.service';
import { GlobalService } from 'src/app/services/Global.service';

@Component({
  selector: 'app-sheetdetail',
  templateUrl: './sheetdetail.component.html',
  styleUrls: ['./sheetdetail.component.css']
})
export class SheetdetailComponent implements OnInit {

  sheettags:Array<any>=[];

  SongArray:Array<music>=[];

  sheetinfo:sheet;

  sheetCount:number;

  pagesize:number=30;

  pagenumber:number=1;

  userinfo:user;

  constructor(private sheetService:SheetService,private router:ActivatedRoute,private msg:NzMessageService,private storg:StorgeService,private musicService:MusicService,private globalService:GlobalService) { }

  ngOnInit() {
    this.userinfo = JSON.parse(this.storg.getSessionStorage("user")) || {};
    this.router.params.subscribe((params:Params)=>{
        this.loadSheetInfo(params["sheetid"])
    })
   
  }

  loadSheetInfo(sheetid){
      this.sheetService.getSheetBysheetIdAndUserid(sheetid,this.userinfo?this.userinfo.userid:null).subscribe((data)=>{
        this.sheetinfo=data.data;
        this.loadSheet(1);
    },(err)=>{
      console.log();
    })
  }
  
  loadSheet(i){
    this.sheetService.getMusicBysheetId(this.sheetinfo.sheetid,i,30).subscribe((data)=>{
      this.SongArray=data.data;
      this.parseTag();
    },(err)=>{
      console.log(err);
    })
  }

  parseTag(){
    var type=this.sheetinfo.type.toString();
    var typearr;
    this.sheettags=[];
    if(this.sheetinfo.type.indexOf('"')!=-1){
      type=type.replace(/"/g,'');
      type=type.substring(1,type.length-1);
      typearr=type.split(",");
    }else{
      type=type.substring(1,type.length-1);
      typearr=type.split(",");
    }

    for(var i=0;i<typearr.length;i++)
    {
      this.sheettags.push(typearr[i]);
    }
  }

  addToAudio(id){
    var arr=new Array();
    arr.push(this.SongArray[id]);
    this.globalService.sendMusicToAudio(arr)
  }

  addSheet(id){
    this.globalService.sendCollectMusic(id);
  }

  IndexChange(index){
    this.loadSheet(index);
  }

  gotocomment(){
    window.location.hash='';
    window.location.hash='comment';
  }

  collectSheet(musicid:number){
    this.globalService.sendCollectMusic(musicid);
  }

  play(index){
    var arr=new Array<music>();
    arr.push(this.SongArray[index]);
    this.globalService.sendMusicToAudio(arr);
  }

  playAll(){
    this.globalService.sendMusicToAudioWait(this.SongArray);
  }
}
