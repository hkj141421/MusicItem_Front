import { Component, OnInit, SimpleChanges, Input } from '@angular/core';
import { sheet } from 'src/app/class/sheet';
import { GlobalService } from 'src/app/services/Global.service';
import { NzMessageService } from 'ng-zorro-antd';
import { ActivatedRoute, Params } from '@angular/router';
import { SheetService } from 'src/app/services/sheet.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-sheetresult',
  templateUrl: './sheetresult.component.html',
  styleUrls: ['./sheetresult.component.css']
})
export class SheetresultComponent implements OnInit {

  result:Array<sheet>;

  pagesize:number=30;

  pagenumber:number=1;

  total:number;
  @Input()
  searchkey:string;

  constructor(private globalService:GlobalService,private msg:NzMessageService,private router:ActivatedRoute,private sheetService:SheetService) { }

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
      this.sheetService.searchsheet(this.searchkey,this.pagenumber,this.pagesize).subscribe((data)=>{
        if(data.status=="200"){this.result=data.data;}
        else console.log(data);
      },(err)=>{
          console.log(err);
      })
    }
  }

  countResult()
  {
    if(this.searchkey&&this.globalService.trim(this.searchkey)!="")
    {
      this.sheetService.CountSearchsheet(this.searchkey).subscribe((data)=>{
        if(data.status=="200"){this.total=data.data;}
        else console.log(data);
      },(err)=>{
          console.log(err);
      })
    }
  }

  ngOnDestroy() {
    console.log("组件销毁")
  }

}
