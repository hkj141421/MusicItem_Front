import { Component, OnInit } from '@angular/core';
import { singer } from 'src/app/class/singer';
import { CommonService } from 'src/app/services/common.service';
import { NzMessageService } from 'ng-zorro-antd';
import { SingerService } from 'src/app/services/singer.service';

@Component({
  selector: 'app-select-singer',
  templateUrl: './select-singer.component.html',
  styleUrls: ['./select-singer.component.css']
})
export class SelectSingerComponent implements OnInit {

  SingerArray:Array<singer>=[];

  SingerCache:Array<singer>=[];

  pageSize:number=30;

  pageIndex:number=1;

  editCache: { [key: string]: any }= {};

  visible:boolean=false;

  title:any;

  total:number;

  key:string="";

  text:string="";

  singerid:any;

  constructor(private com:CommonService,private msg:NzMessageService,private singerService:SingerService) { }

  ngOnInit() {
    this.indexchange();
    this.count();
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
    this.singerService.getAllSinger(this.pageIndex,this.pageSize).subscribe((data)=>{
      if(data.status=='200')
      {
        this.SingerArray=data.data;
        this.SingerCache=[];
         this.SingerArray.forEach((e)=>{
           this.SingerCache.push(this.assgin(e))})
        this.updateEditCache();
      }else console.log(data);
    },(err)=>{
      console.log(err);
    })
  }

  getSearch()
  {
    this.singerService.searchsinger(this.key,this.pageIndex,this.pageSize).subscribe((data)=>{
        if(data.status=='200')
        {
          this.SingerArray=data.data;
          this.SingerCache=[];
          this.SingerArray.forEach((e)=>{
            this.SingerCache.push(this.assgin(e))})
        this.updateEditCache();

        }else console.log(data);
      },(err)=>{
        console.log(err);
      })
  }

  assgin(mus:singer):singer{
    var m=new singer();
    m.singerid=mus.singerid;
    m.singerhotnumber=mus.singerhotnumber;
    m.singerimg=mus.singerimg;
    m.singername=mus.singername;
    m.singersex=mus.singersex;
    m.alias=mus.alias;
    m.albumsize=mus.albumsize;
    m.briefdesc=mus.briefdesc;
    return m;
  }
  startEdit(id: string): void {
    this.editCache[id].edit = true;
    this.editCache[id].expand=true;
  }

  cancelEdit(id: string): void {
    var index=this.SingerCache.findIndex((e,i):boolean=>{return (e.singerid+"")==id})
    Object.assign(this.SingerArray[index],this.SingerCache[index]);
    this.editCache[id].edit =false;
    this.editCache[id].expand=false;
  }

  saveEdit(id: string): void {
    var index=this.SingerCache.findIndex((e,i):boolean=>{return (e.singerid+"")==id})
    this.singerService.updateAllColumData(this.SingerArray[index]).subscribe((data)=>{
      if(data.status=='200')
      {
        Object.assign(this.SingerCache[index],this.SingerArray[index]);
        this.msg.info("保存成功")
      }
    },(err)=>{
        console.log(err);
        this.msg.info("保存失败")
    })
    this.editCache[id].edit = false;
    this.editCache[id].expand=false;
  }

  updateEditCache(): void {
    this.SingerArray.forEach(item => {
      this.editCache[item.singerid] = {
        edit: false,
        checked:false
      };
    });
  }

  allcheck(e:boolean){
    this.SingerArray.forEach(item=>{
      this.editCache[item.singerid].checked=e;
    })
  }

  batchDelete(){
    var array=new Array<number>();
    this.SingerArray.forEach((e)=>{
      if(this.editCache[e.singerid].checked)array.push(e.singerid);
    })
    if(array.length>0)
    {
      this.com.BatchDelete(array,'singer').subscribe((data)=>{
        if(data.status=='200')
        {
          this.SingerArray=this.SingerArray.filter((e)=>{
              return !this.editCache[e.singerid].checked
          })
          Object.assign(this.SingerCache,this.SingerArray);
          if(this.SingerArray.length==0)
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

  checkdesc(singerid){
    
    var index=this.SingerArray.findIndex((e,i):boolean=>{return (e.singerid+"")==singerid})
    this.text=this.SingerArray[index].briefdesc;
    this.title=this.SingerArray[index].singername;
    this.singerid=this.SingerArray[index].singerid;
    this.visible=true;
  }

  savedesc()
  {
    var index=this.SingerArray.findIndex((e,i):boolean=>{return (e.singerid+"")==this.singerid})
    this.SingerArray[index].briefdesc=this.text;
    this.saveEdit(this.singerid);
  }

  close(){
    this.visible=false;
  }

  count(){
    if(this.key!="")
    {
      this.singerService.CountSearchsingerc(this.key).subscribe((data)=>{
        if(data.status=='200')
        {
          this.total=data.data;
        }else console.log(data);
      },(err)=>{
        console.log(err);
      })
    }
    else {
      this.singerService.getAllSingerCount().subscribe((data)=>{
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
