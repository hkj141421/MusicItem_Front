import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { music } from 'src/app/class/music';
import { MusicService } from 'src/app/services/music.service';
import { GlobalService } from 'src/app/services/Global.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-musicresult',
  templateUrl: './musicresult.component.html',
  styleUrls: ['./musicresult.component.css']
})
export class MusicresultComponent implements OnInit {

  result:Array<music>;

  pagesize:number=30;

  pagenumber:number=1;

  total:number;
  @Input()
  searchkey:string;

  constructor(private musicService:MusicService,private globalService:GlobalService,private msg:NzMessageService,private router:ActivatedRoute) { }

  ngOnInit() {
    // this.globalService.searchkey.subscribe((data)=>{
    //   this.searchkey=data;
    //   this.countResult();
    //   this.IndexChange();
    // })
  }

  ngOnChanges(changes: SimpleChanges) {
    this.countResult();
    this.IndexChange();
  }

  collectSheet(musicid)
  {
      this.globalService.sendCollectMusic(musicid);
  }

  IndexChange()
  {
    if(this.searchkey&&this.globalService.trim(this.searchkey)!="")
    {
      this.musicService.searchmusic(this.searchkey,this.pagenumber,this.pagesize).subscribe((data)=>{
        if(data.status=="200"){this.result=data.data;console.log(this.result)}
        else console.log(data);
      },(err)=>{
          console.log(err);
      })
    }
    else  {this.msg.info("搜索关键字不能为空");}
  }

  countResult()
  {
    if(this.searchkey&&this.globalService.trim(this.searchkey)!="")
    {
      this.musicService.CountSearchmusic(this.searchkey).subscribe((data)=>{
        if(data.status=="200"){this.total=data.data;}
        else console.log(data);
      },(err)=>{
          console.log(err);
      })
    }
  }

  play(index)
  {
    var arr=new Array<music>();
    arr.push(this.result[index]);
    this.globalService.sendMusicToAudio(arr);
  }

  

}
