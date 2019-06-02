import { Component, OnInit } from '@angular/core';
import { music } from 'src/app/class/music';
import { GlobalService } from 'src/app/services/Global.service';
import { ActivatedRoute, Params } from '@angular/router';
import { MusicService } from 'src/app/services/music.service';

@Component({
  selector: 'app-bandinfo',
  templateUrl: './bandinfo.component.html',
  styleUrls: ['./bandinfo.component.css']
})
export class BandinfoComponent implements OnInit {

  SongArray:Array<music>=[];

  sheetCount:number=100;

  pagesize:number=25;

  pagenumber:number=1;

  currentbandinfo:any;

  bandInfo:Array<any>=[{name:"新歌榜",introduce:"根据热度对最新的100首歌曲进行排名，每日更新",coverimg:"",value:"newmusic"},
                {name:"全球榜",introduce:"根据热度对站内所有的歌曲进行排名，每日更新",coverimg:"",value:"global"},
                {name:"英文榜",introduce:"根据热度对站内的英文歌曲进行排名，每日更新",coverimg:"",value:"english"},
                {name:"华语榜",introduce:"根据热度对站内的中文歌曲歌曲进行排名，每日更新",coverimg:"",value:"chinese"}]

  constructor(private globalService:GlobalService,private Active:ActivatedRoute,private musicService:MusicService) { }

  ngOnInit() {
    this.Active.params.subscribe((params:Params)=>{
        if(params["name"]=="english")
        {
            this.currentbandinfo=this.bandInfo[2];
        }
        else if(params["name"]=="newmusic")
        {
            this.currentbandinfo=this.bandInfo[0];
        }
        else if(params["name"]=="chinese")
        {
            this.currentbandinfo=this.bandInfo[3];
        }
        else
        {
            this.currentbandinfo=this.bandInfo[1];
        }
        this.getBandData();
    })
  }

  addToAudio(id){
    var arr=new Array();
    arr.push(this.SongArray[id]);
    this.globalService.sendMusicToAudio(arr)
  }

  addSheet(id){
    this.globalService.sendCollectMusic(id);
  }

  IndexChange(){
    this.getBandData();
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

  getBandData()
  {
    this.musicService.getBandList(this.pagenumber,this.pagesize,this.currentbandinfo.value).subscribe((data)=>{
      if(data.status=="200")
      {
        this.SongArray=data.data;
        if(this.currentbandinfo.coverimg=="")this.currentbandinfo.coverimg=this.SongArray[0].musicimg;
      }
      else {console.log(data);}
      },(err)=>{
        console.log(err);
      })
  }
}
