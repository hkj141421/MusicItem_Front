import { Component, OnInit } from '@angular/core';
import { sheet } from 'src/app/class/sheet';
import { CommonService } from 'src/app/services/common.service';
import { NzMessageService } from 'ng-zorro-antd';
import { SheetService } from 'src/app/services/sheet.service';

@Component({
  selector: 'app-select-sheet',
  templateUrl: './select-sheet.component.html',
  styleUrls: ['./select-sheet.component.css']
})
export class SelectSheetComponent implements OnInit {

  SheetArray:Array<sheet>=[];

  SheetCache:Array<sheet>=[];

  pageSize:number=30;

  pageIndex:number=1;

  editCache: { [key: string]: any }= {};

  visible:boolean=false;

  title:any;

  text:any;

  sheetid:any;

  total:number;

  key:string="";

  constructor(private com:CommonService,private msg:NzMessageService,private sheetService:SheetService) { }

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
    this.sheetService.getAllSheet(this.pageIndex,this.pageSize).subscribe((data)=>{
      if(data.status=='200')
      {
        this.SheetArray=data.data;
        this.SheetCache=[];
         this.SheetArray.forEach((e)=>{
           this.SheetCache.push(this.assgin(e))})
        this.updateEditCache();
      }else console.log(data);
    },(err)=>{
      console.log(err);
    })
  }

  getSearch()
  {
    this.sheetService.searchsheet(this.key,this.pageIndex,this.pageSize).subscribe((data)=>{
        if(data.status=='200')
        {
          this.SheetArray=data.data;
          this.SheetCache=[];
          this.SheetArray.forEach((e)=>{
            this.SheetCache.push(this.assgin(e))})
        this.updateEditCache();

        }else console.log(data);
      },(err)=>{
        console.log(err);
      })
  }

  assgin(mus:sheet):sheet{
    var m=new sheet();
    m.coverimg=mus.coverimg;
    m.introduce=mus.introduce;
    m.producer=mus.producer;
    m.sheetid=mus.sheetid;
    m.songsheetname=mus.songsheetname;
    m.state=mus.state;
    m.time=mus.time;
    m.type=mus.type;
    return m;
  }
  startEdit(id: string): void {
    this.editCache[id].edit = true;
    this.editCache[id].expand=true;
  }

  cancelEdit(id: string): void {
    var index=this.SheetCache.findIndex((e,i):boolean=>{return (e.sheetid+"")==id})
    Object.assign(this.SheetArray[index],this.SheetCache[index]);
    this.editCache[id].edit =false;
    this.editCache[id].expand=false;
  }

  saveEdit(id: string): void {
    var index=this.SheetCache.findIndex((e,i):boolean=>{return (e.sheetid+"")==id})
    this.sheetService.updateAllColumData(this.SheetArray[index]).subscribe((data)=>{
      if(data.status=='200')
      {
        Object.assign(this.SheetCache[index],this.SheetArray[index]);
        this.msg.info("修改成功")
      }
    },(err)=>{
        console.log(err);
        this.msg.info("发生错误")
    })
    this.editCache[id].edit = false;
    this.editCache[id].expand=false;
  }

  updateEditCache(): void {
    this.SheetArray.forEach(item => {
      this.editCache[item.sheetid] = {
        edit: false,
        checked:false,
        expand:false
      };
    });
  }

  allcheck(e:boolean){
    this.SheetArray.forEach(item=>{
      this.editCache[item.sheetid].checked=e;
    })
  }

  batchDelete(){
    var array=new Array<number>();
    this.SheetArray.forEach((e)=>{
      if(this.editCache[e.sheetid].checked)array.push(e.sheetid);
    })
    if(array.length>0)
    {
      this.com.BatchDelete(array,'sheet').subscribe((data)=>{
        if(data.status=='200')
        {
          this.SheetArray=this.SheetArray.filter((e)=>{
              return !this.editCache[e.sheetid].checked
          })
          Object.assign(this.SheetCache,this.SheetArray);
          if(this.SheetArray.length==0)
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

  checkdesc(sheetid){
    
    var index=this.SheetArray.findIndex((e,i):boolean=>{return (e.sheetid+"")==sheetid})
    this.text=this.SheetArray[index].introduce;
    this.title=this.SheetArray[index].songsheetname;
    this.sheetid=this.SheetArray[index].sheetid;
    this.visible=true;
  }

  savedesc()
  {
    var index=this.SheetArray.findIndex((e,i):boolean=>{return (e.sheetid+"")==this.sheetid})
    this.SheetArray[index].introduce=this.text;
    this.saveEdit(this.sheetid);
  }

  close(){
    this.visible=false;
  }

  count(){
    if(this.key!="")
    {
      this.sheetService.CountSearchsheet(this.key).subscribe((data)=>{
        if(data.status=='200')
        {
          this.total=data.data;
        }else console.log(data);
      },(err)=>{
        console.log(err);
      })
    }
    else {
      this.sheetService.getAllSheetCount().subscribe((data)=>{
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
