import { Component, OnInit, SimpleChanges, Input } from '@angular/core';
import { GlobalService } from 'src/app/services/Global.service';
import { SingerService } from 'src/app/services/singer.service';
import { singer } from 'src/app/class/singer';

@Component({
  selector: 'app-singerresult',
  templateUrl: './singerresult.component.html',
  styleUrls: ['./singerresult.component.css']
})
export class SingerresultComponent implements OnInit {

  result:Array<singer>;

  pagesize:number=30;

  pagenumber:number=1;

  total:number;
  @Input()
  searchkey:string;

  constructor(private globalService:GlobalService,private singerService:SingerService) { }

  ngOnInit() {
    // this.globalService.searchkey.subscribe((data)=>{
    //   console.log("sheetkey="+data);
    //   this.searchkey=data;
    //   this.countResult();
    //   this.IndexChange();
    // })
  }

  ngOnChanges(changes: SimpleChanges) {
        this.countResult();
      this.IndexChange();
  }

  IndexChange()
  {
    if(this.searchkey&&this.globalService.trim(this.searchkey)!="")
    {
      this.singerService.searchsinger(this.searchkey,this.pagenumber,this.pagesize).subscribe((data)=>{
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
      this.singerService.CountSearchsingerc(this.searchkey).subscribe((data)=>{
        if(data.status=="200"){this.total=data.data;}
        else console.log(data);
      },(err)=>{
          console.log(err);
      })
    }
  }
}
