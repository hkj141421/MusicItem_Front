import { Component, OnInit, Input } from '@angular/core';
import { MusicService } from 'src/app/services/music.service';
import { music } from 'src/app/class/music';
import { NzMessageService } from 'ng-zorro-antd';
import { ActivatedRoute, Params } from '@angular/router';
import { SheetService } from 'src/app/services/sheet.service';
import { StorgeService } from 'src/app/services/storge.service';
import { sheet } from 'src/app/class/sheet';
import { GlobalService } from 'src/app/services/Global.service';

@Component({
  selector: 'app-music-info',
  templateUrl: './music-info.component.html',
  styleUrls: ['./music-info.component.css']
})
export class MusicInfoComponent implements OnInit {

  lrcArray:Array<string>;

  lrcheight:any="300px";

  musicInfo:music;

  constructor(private musicService:MusicService,private msg:NzMessageService,private router:ActivatedRoute,private sheetService:SheetService,private storge:StorgeService,private globalService:GlobalService) { }

  ngOnInit() {
    this.router.params.subscribe((params:Params)=>{
      
      this.loadMusicInfo(params["musicid"])
    })
    this.loadLrc
  }

  loadMusicInfo(id){
      this.musicService.getMusicInfoByid(id).subscribe((data)=>{
        if(data.status==200){
          this.musicInfo=data.data;
          this.loadLrc(this.musicInfo.lyricid);
        }else{
            this.msg.info("找不到数据"+id);
        }
      },(err)=>{
        console.log(err);
      })
  }

  loadLrc(lrcid){
    this.musicService.requestLrc(lrcid).subscribe((data)=>{
      this.lrcArray=data.data[1]
    },(err)=>{
      console.log(err);
    })
  }

  showlrc(){
    this.lrcheight="";
  }

  closelrc(){
    this.lrcheight="300px";
  }

  addToSheet(i)
  {
    this.globalService.sendCollectMusic(i);
  }

  play(){
    var arr=new Array<music>();
    arr.push(this.musicInfo);
    this.globalService.sendMusicToAudio(arr);
  }

}
