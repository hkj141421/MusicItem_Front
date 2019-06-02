import { Component, OnInit } from '@angular/core';
import { sheet } from 'src/app/class/sheet';
import { SheetService } from 'src/app/services/sheet.service';

@Component({
  selector: 'app-all-sheet',
  templateUrl: './all-sheet.component.html',
  styleUrls: ['./all-sheet.component.css']
})
export class AllSheetComponent implements OnInit {

  Sheetlist:Array<sheet>;

  pageSize:number=30;

  pageIndex:number;

  total:number;

  selectType:string="全部";

  language=["华语","日语","小语种","韩语","英语"];

  style=["流行","民族","电子","古典","旅行","翻唱","轻音乐","说唱","游戏"]

  emotion=["怀旧","浪漫","运动","兴奋","安静","思念"]

  constructor(private sheetService:SheetService) { }

  ngOnInit() {
    this.loadSheetData(1,30,this.selectType);
    this.loadSheetCount(this.selectType);
  }

  loadSheetData(pagenum,size,type)
  {
    this.sheetService.getsheetpage(pagenum,size,type).subscribe((data)=>{
      if(data.status=="200")this.Sheetlist=data.data;
      else {console.log(data); }
    },(err)=>{
      console.log(err);
    })
  }

  loadSheetCount(type)
  {
    this.sheetService.getsheetCount(type).subscribe((data)=>{
      if(data.status=="200")this.total=data.data;
      else {console.log(data); }
    },(err)=>{
      console.log(err);
    })
  }

  pageIndexChange()
  {
    var t=this.selectType;
    if(this.selectType=="英语")t="欧美";
    this.loadSheetData(this.pageIndex,30,this.selectType);
  }

  selectTag(type)
  {
    this.selectType=type;
    var t=this.selectType;
    if(this.selectType=="英语")t="欧美";
    this.loadSheetCount(t);
    this.loadSheetData(1,30,t);
  }

}
