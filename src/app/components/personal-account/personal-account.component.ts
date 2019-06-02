import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { NzMessageService } from 'ng-zorro-antd';
import { user } from 'src/app/class/user';
import { StorgeService } from 'src/app/services/storge.service';

@Component({
  selector: 'app-personal-account',
  templateUrl: './personal-account.component.html',
  styleUrls: ['./personal-account.component.css']
})
export class PersonalAccountComponent implements OnInit {

  VerificationCode:any;

  Visable:boolean=true;

  email:any="";

  repwdVisible:boolean=false;

  newpwdVisible:boolean=false;

  oldpwdVisible:boolean=false;

  useremail:any="670378784@qq.com";

  emailcollection=[];

  time:any;

  Codebtn:boolean=false;

  pwdGroup={
    oldpwd:"",
    oldpwdVisible:false,
    newpwd:"",
    newpwdVisible:false,
    repwd:"",
    repwdVisible:false
  }

  CodeBtnText:any="发送验证码";

  emailGroup={
    useremail:"670378784@qq.com",
    newemail:"",
    VerificationCode:""
  };

  constructor(private builder:FormBuilder,private com:CommonService,private msg:NzMessageService,private storge:StorgeService) { 
    
  }

  ngOnInit() {
    this.com.UserInfo.subscribe((data:user)=>{
      this.emailGroup.useremail=data.email;
    })
  }

  equalValidator(formGroup:FormGroup):any{
    var newpwd=formGroup.get("newpwd").value;
    var repwd=formGroup.get("repwd").value;
    var state=newpwd===repwd
    return state?null:{equal:true};
  }

  onemailChange(value: string): void {
    if (!value || value.indexOf('@') >= 0) {
      this.emailcollection = [];
    } else {
      this.emailcollection = ['gmail.com', '163.com', 'qq.com','126.com',
          'yahoo.com','outlook.com','sina.com','sohu.com','year.net']
      .map(domain => `${value}@${domain}`);
    }
  }

  saveEmail(){
      if(this.emailGroup.newemail!=""&&this.emailGroup.newemail==this.email)
      {
        this.com.saveEmail(this.emailGroup.newemail,this.emailGroup.VerificationCode).subscribe((data)=>{
          this.msg.info("邮箱绑定成功");
          this.emailGroup.useremail=this.emailGroup.newemail;
          this.emailGroup.newemail="";
          this.emailGroup.VerificationCode="";
          var json=JSON.parse(this.storge.getSessionStorage("user"));
          json.email=this.emailGroup.useremail;
          this.storge.setSessionStorage("user",json);
          this.com.sendUserInfo(json);
        },(err)=>{
          this.msg.error("邮箱绑定失败");
          console.log(err);
        })
        
      }else{
        this.msg.error("邮箱无效");
      }
    
  }

  savepwd(){
    if(this.pwdGroup.oldpwd!=""&&this.pwdGroup.newpwd!=""&&this.pwdGroup.newpwd==this.pwdGroup.repwd){
      this.com.changepwd(this.pwdGroup.newpwd,this.pwdGroup.oldpwd).subscribe((data)=>{
          if(data.status==200)this.msg.info("修改失败")
          else{this.msg.info("修改成功") }
      },(err)=>{
          this.msg.error("修改失败")
          console.log(err);
      })
    }else{
      if(this.pwdGroup.oldpwd=="")this.msg.error("原密码不能为空");
      else if(this.pwdGroup.newpwd=="")this.msg.error("新密码不能为空");
      else if(this.pwdGroup.newpwd!=this.pwdGroup.repwd)this.msg.error("两次密码不相等");
    }
  }
  timecount:number=60;

  sendCode(){
    this.email=this.emailGroup.newemail;
    if(this.emailGroup.newemail!=""){
      this.com.sendEmailCode(this.emailGroup.newemail).subscribe((data:any)=>{

        if(data.status==200){
          this.VerificationCode=data.data;
          
            this.Codebtn=true;
            this.timecount=60;
            this.time=setInterval((i) => {
                this.timecount--;
                this.CodeBtnText=this.timecount+"S后可重发";
                if(this.timecount==0){
                  clearInterval(this.time);
                  this.Codebtn=false;
                  this.CodeBtnText="发送验证码";
                }
              }, 1000);
            setTimeout(()=>{this.VerificationCode=""},1000*60*30)
        }else{
          this.msg.error("发送出错:"+data.msg);
        }
        
      },(err)=>{
        console.log(err);
      })
    }else{
      this.msg.info("请填写您要绑定的邮箱");
    }
  }
}
