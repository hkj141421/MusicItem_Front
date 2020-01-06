import { Component, OnInit } from '@angular/core';
import { MusicService } from 'src/app/services/music.service';
import { SheetService } from 'src/app/services/sheet.service';
import { StorgeService } from 'src/app/services/storge.service';
import { GlobalService } from 'src/app/services/Global.service';
import { NzMessageService } from 'ng-zorro-antd';
import { sheet } from 'src/app/class/sheet';

@Component({
  selector: 'app-collect-music',
  templateUrl: './collect-music.component.html',
  styleUrls: ['./collect-music.component.css']
})
export class CollectMusicComponent implements OnInit {

  AddSheetVisibale:boolean=false;

  collectMusicid:any;

  userSheet:Array<sheet>;

  constructor(private musicService:MusicService,private sheetService:SheetService,private storg:StorgeService,private globalService:GlobalService,private msg:NzMessageService) { }

  ngOnInit() {
    this.globalService.collectmusicid.subscribe((data)=>{
      console.log('订阅组件'+data);
      this.addToSheet(data);
    })
  }

  addToSheet(i)
  {
    var user=JSON.parse(this.storg.getSessionStorage("user"));
    if(user)
    { 
      this.sheetService.getUserSheet(user.userid,user.username).subscribe((data)=>{
        if(data.status=='200')
        {
          
          this.userSheet=data.data;
          this.AddSheetVisibale=true;
          this.collectMusicid=i;
        }
        else {this.msg.error("获取用户歌单失败，请稍后重试");}
      },(err)=>{
          console.log(err);
          this.msg.error("获取用户歌单失败，请稍后重试");
      })
    }
    else
    {
      this.msg.info("请登录后收藏歌曲");
    }
  }

  
  AddMusicToSheet(sheetid)
  { 
    this.AddSheetVisibale=false;
    if(sheetid!=null)
    {
        this.musicService.collectSong(this.collectMusicid,sheetid).subscribe((data)=>{
          if(data.status=='200')
          {
            this.msg.info('收藏成功')
          }
          else {console.log(data);this.msg.info('歌曲已收录，请勿重复收藏');}
        },(err)=>{
          this.msg.info('收藏失败')
        })    
    }     
  }

}
