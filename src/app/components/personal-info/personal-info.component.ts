import { Component, OnInit } from '@angular/core';
import { NzMessageService,UploadFile } from 'ng-zorro-antd';
import { Observable, Observer } from 'rxjs';
import { FormGroupName, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CityData } from '../../class/CityData';
import { CommonService } from 'src/app/services/common.service';
import { user } from 'src/app/class/user'

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.css']
})
export class PersonalInfoComponent implements OnInit {

  preferenceArray:Array<any>=[];//用户的音乐倾向

  provinceArray:Array<string>;//省数据

  cityArray:Array<string>;//市数据

  userinfo:user=new user();//用户数据

  tags=[
    {name:"华语",color:"#f50",selectcolor:"#FFB6C1"},
    {name:"流行",color:"#2db7f5",selectcolor:"#FFB6C1"},
    {name:"日语",color:"#87d068",selectcolor:"#FFB6C1"},
    {name:"民族",color:"#108ee9",selectcolor:"#FFB6C1"},
    {name:"怀旧",color:"#D15FEE",selectcolor:"#FFB6C1"},
    {name:"电子",color:"#CD0000",selectcolor:"#FFB6C1"},
    {name:"古典",color:"#F4A460",selectcolor:"#FFB6C1"},
    {name:"欧美",color:"#B03060",selectcolor:"#FFB6C1"},
    {name:"浪漫",color:"#A020F0",selectcolor:"#FFB6C1"},
    {name:"放松",color:"#7FFF00",selectcolor:"#FFB6C1"},
    {name:"旅行",color:"#00CDCD",selectcolor:"#FFB6C1"},
    {name:"翻唱",color:"#EEE0E5",selectcolor:"#FFB6C1"},
    {name:"电子",color:"#DAA520",selectcolor:"#FFB6C1"},
    {name:"轻音乐",color:"#FFD700",selectcolor:"#FFB6C1"},
    {name:"运动",color:"#FFF68F",selectcolor:"#FFB6C1"},
    {name:"夜晚",color:"#FF8C69",selectcolor:"#FFB6C1"},
    {name:"影视原声",color:"#FA8072",selectcolor:"#FFB6C1"},
    {name:"小语种",color:"#EEC900",selectcolor:"#FFB6C1"},
    {name:"清新",color:"#EE9572",selectcolor:"#FFB6C1"},
    {name:"说唱",color:"#EE3A8C",selectcolor:"#FFB6C1"},
    {name:"爵士",color:"#D1EEEE",selectcolor:"#FFB6C1"},
    {name:"游戏",color:"#D15FEE",selectcolor:"#FFB6C1"}
  ]

  previewImage:string | undefined = '';

  previewVisible = false;

  preview=(file: UploadFile)=>{

  }
  personInfo:FormGroup=this.personInfo=this.builder.group({
    name:[''],
    sex:[''],
    birth:[''],
    location:this.builder.group({
      province:[''],
      city:['']
    }),
    introduce:[''],
  });//个人信息表单模型

  loading = false;

  avatarUrl: string//="http://localhost:1122/static/images/Headportrait.png";

  cityData:CityData=new CityData();//省市数据源

  Headimage:UploadFile[]=[];//上传的用户头像信息

  uploading:boolean;

  fileReader:FileReader=new FileReader();

  imagefile:any;

  constructor(private builder:FormBuilder,private message:NzMessageService,private com:CommonService) { 

  }

  ngOnInit() {
    this.provinceArray=this.cityData.getprovince();
    this.com.UserInfo.subscribe((data:user)=>{
      this.userinfo=data;
      this.initInfo();
    },(err)=>{
      console.log(err)
    })
  //   this.com.getUserInfo().subscribe((data)=>{
  //     this.userinfo=data.data
  //     this.initInfo();
  // },(err)=>{
  //     console.log(err);
  // })
  }

  initInfo(){

    if(this.userinfo.location&&this.userinfo.location!=null&&this.userinfo.location!="")
    {
      var province=this.userinfo.location.split(" ")[0];
      var city="";
      if(this.userinfo.location.split(" ").length>1)
      city=this.userinfo.location.split(" ")[1];
      
      this.personInfo.get("location").get("province").setValue(province);
      var cityIndex=this.provinceArray.findIndex(e=>e==province);
      if(cityIndex!=-1)
      {
        this.cityArray=this.cityData.getCity()[cityIndex];
        this.personInfo.get("location").get("city").setValue(city);
      }
    }
    this.personInfo.get("name").setValue(this.userinfo.username);
    if(this.userinfo.birthday&&this.userinfo.birthday!=null&&this.userinfo.birthday!="")
    {
      this.personInfo.get("birth").setValue(this.userinfo.birthday);
    }
    this.personInfo.get("sex").setValue(this.userinfo.sex);
    if(this.userinfo.signature&&this.userinfo.signature!=null&&this.userinfo.signature!="")
    {
      this.personInfo.get("introduce").setValue(this.userinfo.signature);
    }
    if(this.userinfo.musicpreference&&this.userinfo.musicpreference!=null&&this.userinfo.musicpreference!="")
    {
      
      var tagStr=this.userinfo.musicpreference.substr(1,this.userinfo.musicpreference.length-2);
      var tagArr=tagStr.split(",");
      for (let i = 0; i < tagArr.length; i++) {
       
        this.tags.forEach((el,index)=>{
          if(el.name==tagArr[i]){
            this.addOrDeletetag(index);
          }
        });
      }
    }

  }

  loadCity(){
    var province=this.personInfo.get("location").get("province").value;
    var index=this.provinceArray.findIndex(e=>e==province);
    this.cityArray=this.cityData.city[index];
    this.personInfo.get("location").get("city").setValue(this.cityArray[0]);
    
  }

  changeTagColor(i){
    var color=this.tags[i].color;
    this.tags[i].color=this.tags[i].selectcolor;
    this.tags[i].selectcolor=color;
  }

  addOrDeletetag(i){
    if(this.preferenceArray.length>=5){
      this.message.info("最多选取5个标签");
    }else{
      if(this.preferenceArray.length==0){
        this.changeTagColor(i);
        this.preferenceArray.push(this.tags[i]);
      }else{
        var flag=this.preferenceArray.find(e=>e.name==this.tags[i].name)
        if(flag){
          this.changeTagColor(i);
          this.preferenceArray=this.preferenceArray.filter(e=>e.name!=this.tags[i].name);
        }else{
          this.changeTagColor(i);
          this.preferenceArray.push(this.tags[i]);
        }
        
      }
    }  
  }

  deletetag(i){
    let index=this.tags.findIndex(e=>e.name==this.preferenceArray[i].name);
    this.changeTagColor(index);
    this.preferenceArray=this.preferenceArray.filter(e=>e.name!=this.preferenceArray[i].name); 
  }


  handleUpload(): void {
    // tslint:disable-next-line:no-any
    this.com.handleUpload(this.Headimage[0]).subscribe((data)=>{
      this.Headimage=[];
      this.userinfo.userheadimg=data.data;
    },(err)=>{
      this.message.info("头像上传失败");
      console.log(err);
    })
   
  }

  beforeUpload=(file: UploadFile) =>{
    if(file.size<2*1024*1024)
    {
      this.Headimage.pop();
      this.Headimage=this.Headimage.concat(file);
    }else{
      this.message.error("文件大小不能超过2MB");
    }
    return false;
  }

  anouser:user=new user();

  save(){
    if(this.personInfo.status=="VALID"){
     // var user=new user();
     this.anouser.username=this.personInfo.get("name").value;
     this.anouser.signature=this.personInfo.get("introduce").value;
     this.anouser.birthday=this.personInfo.get("birth").value;
      if(this.personInfo.get("location").get("province").value!=this.personInfo.get("location").get("city").value){
        this.anouser.location=this.personInfo.get("location").get("province").value+" "+this.personInfo.get("location").get("city").value;
      }else{
        this.anouser.location=this.personInfo.get("location").get("province").value;
      }
      this.anouser.sex=this.personInfo.get("sex").value;
      this.anouser.musicpreference="["
      this.preferenceArray.forEach((e,index)=>{this.anouser.musicpreference+=e.name+","});
      this.anouser.musicpreference.substr(0,this.anouser.musicpreference.length-1)+"]";
      if(this.Headimage.length>0)
      {
        this.handleUpload()
      }
      this.com.updateUserInfo(this.anouser).subscribe((data)=>{
            this.message.info("修改成功");
      },(err)=>{
         this.message.error("修改失败");
         console.log(err);
      })
    }
    else{
      this.message.error("用户名是必填项")
    }
    
  }

}

