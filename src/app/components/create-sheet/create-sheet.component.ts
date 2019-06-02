import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SheetService } from 'src/app/services/sheet.service';
import { sheet } from '../../class/sheet';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-create-sheet',
  templateUrl: './create-sheet.component.html',
  styleUrls: ['./create-sheet.component.css']
})
export class CreateSheetComponent implements OnInit {

  SheetForm:FormGroup=this.builder.group({
    sheetname:['',[Validators.required]],
    tags:['',[Validators.required]],
    introduction:['',[Validators.required]]
  });

  @Input()
  visible:boolean;

  @Output()
  visibleChange:EventEmitter<boolean>=new EventEmitter();

  visibleStatus:boolean;

  @Output()
  sheetChange:EventEmitter<sheet>=new EventEmitter();

  sheet:sheet;

  a:string="";

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

  constructor(private builder:FormBuilder,private sheetService:SheetService,private message:NzMessageService) { 
    
  }

  ngOnInit() {
  }

  close(){
    this.visibleChange.emit(false);
    this.SheetForm.reset();
  }

  uploadImg(){
    
  }


  createSheet(){
    this.sheet=new sheet();
    sheet.prototype.songsheetname=this.SheetForm.get("sheetname").value;
    sheet.prototype.type=this.SheetForm.get("tags").value.split(",");
    sheet.prototype.introduce=this.SheetForm.get("introduction").value;

    this.sheetService.createSheet(this.sheet).subscribe((data)=>{
        if(data.status!=200){this.message.info(data.msg)}
        else{
          this.sheetChange.emit(data.data);
          this.SheetForm.reset();
          this.visibleChange.emit(false);
        }
      },(err)=>{
        this.message.info(err);
    })
  }

  checkTags(i){
    var color=this.tags[i].color;
    this.tags[i].color=this.tags[i].selectcolor;
    this.tags[i].selectcolor=color;
    var value=this.SheetForm.get("tags").value;
    var t;
    if(value==null){t=-1;}
    else t=value.indexOf(this.tags[i].name);
    if(t==-1){//判断标签是否在tag表单中存在
      if(this.SheetForm.get("tags").value!=""&&this.SheetForm.get("tags").value!=null){
        this.SheetForm.get("tags").setValue(this.SheetForm.get("tags").value+","+this.tags[i].name);
      }else{
        this.SheetForm.get("tags").setValue(this.tags[i].name);
      }
    }else{
      
        var str1=value.substr(0,t-1);
        var str2;
        if(t!=0){
          str2=value.substr(t+this.tags[i].name.length+2);
        }else{
          str2=value.substr(t+this.tags[i].name.length+3);
        }
        this.SheetForm.get("tags").setValue(str1+str2);
        
    }

  }

}
