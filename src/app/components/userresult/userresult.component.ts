import { Component, OnInit, SimpleChanges, Input } from '@angular/core';
import { GlobalService } from 'src/app/services/Global.service';
import { user } from 'src/app/class/user';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-userresult',
  templateUrl: './userresult.component.html',
  styleUrls: ['./userresult.component.css']
})
export class UserresultComponent implements OnInit {

  result:Array<user>;

  pagesize:number=30;

  pagenumber:number=1;

  total:number;
  @Input()
  searchkey:string;

  constructor(private globalService:GlobalService,private com:CommonService) { }

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

  IndexChange()
  {
    if(this.searchkey&&this.globalService.trim(this.searchkey)!="")
    {
      this.com.searchuser(this.searchkey,this.pagenumber,this.pagesize).subscribe((data)=>{
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
      this.com.CountSearchuser(this.searchkey).subscribe((data)=>{
        if(data.status=="200"){this.total=data.data;}
        else console.log(data);
      },(err)=>{
          console.log(err);
      })
    }
  }

}
