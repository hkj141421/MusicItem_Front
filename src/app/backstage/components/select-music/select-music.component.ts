import { Component, OnInit } from '@angular/core';
import { music } from 'src/app/class/music';
import { MusicService } from 'src/app/services/music.service';
import { CommonService } from 'src/app/services/common.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-select-music',
  templateUrl: './select-music.component.html',
  styleUrls: ['./select-music.component.css']
})
export class SelectMusicComponent implements OnInit {

  MusicArray:Array<music>=[];

  MusicCache:Array<music>=[];

  pageSize:number=30;

  pageIndex:number=1;

  editCache: { [key: string]: any }= {};

  lrctext:Array<any>;

  lrctime:Array<any>;

  visible:boolean=false;

  lrctitle:any;

  total:number;

  key:string="";

  constructor(private musicService:MusicService,private com:CommonService,private msg:NzMessageService) { }

  ngOnInit() {
    this.count();
    this.indexchange();
  }

  indexchange(){
    if(this.key!="")
    {
        this.getSearch();
    }
    else {
      this.getAllPage();
    }
  }

  getAllPage()
  {
    this.musicService.getAllMusic(this.pageIndex,this.pageSize).subscribe((data)=>{
      if(data.status=='200')
      {
        this.MusicArray=data.data;
        this.MusicCache=[];
         this.MusicArray.forEach((e)=>{
           this.MusicCache.push(this.assgin(e))})
        this.updateEditCache();
      }else console.log(data);
    },(err)=>{
      console.log(err);
    })
  }

  getSearch()
  {
    this.musicService.searchmusic(this.key,this.pageIndex,this.pageSize).subscribe((data)=>{
        if(data.status=='200')
        {
          this.MusicArray=data.data;
          this.MusicCache=[];
          this.MusicArray.forEach((e)=>{
            this.MusicCache.push(this.assgin(e))})
        this.updateEditCache();

        }else console.log(data);
      },(err)=>{
        console.log(err);
      })
  }

  assgin(mus:music):music{
    var m=new music();
    m.album=mus.album;
    m.creationdate=mus.creationdate;
    m.language=mus.language;
    m.lyricid=mus.lyricid;
    m.musicaddress=mus.musicaddress;
    m.musicid=mus.musicid;
    m.musicimg=mus.musicimg;
    m.musicname=mus.musicname;
    m.playnumber=mus.playnumber;
    m.singer=mus.singer;
    m.time=mus.time;
    m.type=mus.type;
    return m;
  }
  startEdit(id: string): void {
    this.editCache[id].edit = true;
    this.editCache[id].expand=true;
  }

  cancelEdit(id: string): void {
    var index=this.MusicCache.findIndex((e,i):boolean=>{return (e.musicid+"")==id})
    Object.assign(this.MusicArray[index],this.MusicCache[index]);
    this.editCache[id].edit =false;
    this.editCache[id].expand=false;
  }

  saveEdit(id: string): void {
    var index=this.MusicCache.findIndex((e,i):boolean=>{return (e.musicid+"")==id})
    this.musicService.updateAllColumData(this.MusicArray[index]).subscribe((data)=>{
      if(data.status=='200')
      {
        Object.assign(this.MusicCache[index],this.MusicArray[index]);
      }
    },(err)=>{
        console.log(err);
    })
    this.editCache[id].edit = false;
    this.editCache[id].expand=false;
  }

  updateEditCache(): void {
    this.MusicArray.forEach(item => {
      this.editCache[item.musicid] = {
        edit: false,
        expand:false,
        checked:false
      };
    });
  }

  allcheck(e:boolean){
    this.MusicArray.forEach(item=>{
      this.editCache[item.musicid].checked=e;
    })
  }

  batchDelete(){
    var array=new Array<number>();
    this.MusicArray.forEach((e)=>{
      if(this.editCache[e.musicid].checked)array.push(e.musicid);
    })
    if(array.length>0)
    {
      this.com.BatchDelete(array,'music').subscribe((data)=>{
        if(data.status=='200')
        {
          this.MusicArray=this.MusicArray.filter((e)=>{
              return !this.editCache[e.musicid].checked
          })
          Object.assign(this.MusicCache,this.MusicArray);
          if(this.MusicArray.length==0)
          {
            this.count();
            this.indexchange();
          }
          this.msg.info("删除成功")
        }
      },(err)=>{
          console.log(err);
      })
    }
    else this.msg.info("请选择你要删除的数据")

  }

  checkLRc(lricid,name){
      this.musicService.requestLrc(lricid).subscribe((data)=>{
        if(data.status=='200')
        {
          this.lrctime=data.data[0];this.lrctext=data.data[1];
          this.visible=true;
          this.lrctitle=name;
        }else console.log(data);
      },(err)=>{
        console.log(err);
      });
  }
  close(){
    this.visible=false;
  }

  count(){
    if(this.key!="")
    {
      this.musicService.CountSearchmusic(this.key).subscribe((data)=>{
        if(data.status=='200')
        {
          this.total=data.data;
        }else console.log(data);
      },(err)=>{
        console.log(err);
      })
    }
    else {
      this.musicService.getAllMusicCount().subscribe((data)=>{
        if(data.status=='200')
        {
          this.total=data.data;
        }else console.log(data);
      },(err)=>{
        console.log(err);
      })
    }

  }

  search(){
    if(this.pageIndex==1){this.getSearch();}
    else {this.pageIndex=1;}
    this.count();
  }

  reset(){
    this.key="";
    if(this.pageIndex==1){this.getAllPage();}
    else {this.pageIndex=1;}
    this.count();
  }

}
