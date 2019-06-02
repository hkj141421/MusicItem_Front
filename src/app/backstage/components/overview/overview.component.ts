import { Component, OnInit } from '@angular/core';
import { user } from 'src/app/class/user';
import { music } from 'src/app/class/music';
import { GlobalService } from 'src/app/services/Global.service';
import { SheetService } from 'src/app/services/sheet.service';
import { MusicService } from 'src/app/services/music.service';
import { CommonService } from 'src/app/services/common.service';
import { SingerService } from 'src/app/services/singer.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  data:Array<any>=[{title:'音乐数量',value:'0',prex:'../../../../assets//images//1547217487442.jpg'},
                  {title:'歌手数量',value:'0',prex:'../../../../assets//images//1547217487442.jpg'},
                  {title:'歌单数量',value:'0',prex:'../../../../assets//images//1547217487442.jpg'},
                  {title:'用户数量',value:'0',prex:'../../../../assets//images//1547217487442.jpg'}]

  userArray:Array<any>;
  
  SongArray:Array<music>=[];

  constructor(private globalService:GlobalService,private sheetService:SheetService,private musicService:MusicService,private com:CommonService,private singerService:SingerService) { }

  ngOnInit() {
    this.loadCount();
    this.loadSheet();
    this.loadUser();
  }


  loadCount()
  {
    this.sheetService.getAllSheetCount().subscribe((data)=>{
      this.data[2].value=data.data;
    },(err)=>{
      console.log(err);
    })

    this.com.getAlluserCount().subscribe((data)=>{
      this.data[3].value=data.data;
    },(err)=>{
      console.log(err);
    })

    this.singerService.getAllSingerCount().subscribe((data)=>{
      this.data[1].value=data.data;
    },(err)=>{
      console.log(err);
    })

    this.musicService.getAllMusicCount().subscribe((data)=>{
      this.data[0].value=data.data;
    },(err)=>{
      console.log(err);
    })
  }
  play(index){
    var arr=new Array<music>();
    arr.push(this.SongArray[index]);
    this.globalService.sendMusicToAudio(arr);
  }

  loadSheet(){
    this.sheetService.getMusicBysheetId(20,1,18).subscribe((data)=>{
      this.SongArray=data.data;
    },(err)=>{
      console.log(err);
    })
  }

  loadUser(){
    this.com.getAlluser(1,7).subscribe((data)=>{
      if(data.status=='200')
      {
        this.userArray=data.data
      }else console.log(data);
    },(err)=>{
      console.log(err);
    })
  }

}
