import { Component, OnInit } from '@angular/core';
import { user } from 'src/app/class/user';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-select-user',
  templateUrl: './select-user.component.html',
  styleUrls: ['./select-user.component.css']
})
export class SelectUserComponent implements OnInit {

  UserArray:Array<user>=[];

  editCache: { [key: string]: any }= {};

  pageSize:number=30;

  pageIndex:number=1;

  visible:boolean=false;

  signature:any;

  title:any;

  total:number;

  key:string="";

  constructor(private com:CommonService) { }

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
    this.com.getAlluser(this.pageIndex,this.pageSize).subscribe((data)=>{
      if(data.status=='200')
      {
        this.UserArray=data.data;
        this.updateEditCache();
      }else console.log(data);
    },(err)=>{
      console.log(err);
    })
  }

  getSearch()
  {
    this.com.searchuser(this.key,this.pageIndex,this.pageSize).subscribe((data)=>{
        if(data.status=='200')
        {
          this.UserArray=data.data;
          this.updateEditCache();
        }else console.log(data);
      },(err)=>{
        console.log(err);
      })
  }


  stop(userid,status)
  {
    var index=this.UserArray.findIndex((e)=>{return e.userid==userid});
    
    this.com.updateAllColumData(userid,status).subscribe((data)=>{
        if(data.status=='200')
        {
          this.UserArray[index].status=1;
        }else {console.log(data)}
    },(err)=>{
      console.log(err)
    })
  }
  checkSign(userid){
      var index=this.UserArray.findIndex((e)=>{return e.userid==userid})
      this.signature=this.UserArray[index].signature;
      this.title=this.UserArray[index].username;
      this.visible=true;
  }
  close(){
    this.visible=false;
  }

  count(){
    if(this.key!="")
    {
      this.com.CountSearchuser(this.key).subscribe((data)=>{
        if(data.status=='200')
        {
          this.total=data.data;
        }else console.log(data);
      },(err)=>{
        console.log(err);
      })
    }
    else {
      this.com.getAlluserCount().subscribe((data)=>{
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

  updateEditCache(): void {
    this.editCache=[];
    this.UserArray.forEach(item => {
      this.editCache[item.userid] = {
        expand:false
      };
    });
  }

}
