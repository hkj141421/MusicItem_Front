import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators, FormControl, AsyncValidator } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { user } from 'src/app/class/user';
import {  Router } from '@angular/router';
import { Observable } from 'rxjs/observable';
import 'rxjs/Rx'
import { debounceTime,switchMap, map, first, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  code:string="";

  VerImg:any="";

  VerCode:any;

  time:any;

  timecount:number;

  registerGroup:FormGroup;

  emailCodebtn:boolean=true;

  constructor(private http:HttpClient,private msg:NzMessageService,private sanitizer:DomSanitizer,private builder:FormBuilder,private common:CommonService,private router:Router) { }

  ngOnInit() {
    this.getCode();
    this.registerGroup=this.builder.group({
      email:["",[Validators.required,Validators.email]],
      verifycode:["",[Validators.required]],
      emailverifycode:["",Validators.required],
      account:["",Validators.required,this.useraccountUniqueValidator],
      username:["",Validators.required,this.userNameUniqueValidator],
      password:["",Validators.required],
      repassword:["",Validators.required]
      
    })
    
  }

  refushCode(){
    this.getCode();
  }
  checkCode(){
    this.common.checkVeriCode(this.code).subscribe((data:any)=>{
      if(data.status=="200"){this.msg.info("验证成功");}
      else{ 
              this.msg.info("验证失败")
              this.getCode();
          }
    },(err:any)=>{
      this.msg.info("验证失败")
      console.log(err);
    })
  }

  getCode(){
    this.common.getVeriCode().subscribe((data:any)=>{
      this.VerImg=this.sanitizer.bypassSecurityTrustUrl(data.data[0]);
      this.VerCode=data.data[1];
    },(err)=>{
      console.log(err);
    })
  }

  sendEmailCode(){
    if(this.registerGroup.get("email").value!=""){
      this.common.sendEmailCode(this.registerGroup.get("email").value).subscribe((data:any)=>{
        if(data.status==200){
            this.emailCodebtn=false;
            this.timecount=60;
            this.time=setInterval((i) => {
                this.timecount--;
                if(this.timecount==0){
                  clearInterval(this.time);
                  this.emailCodebtn=true;
                }
              }, 1000);
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

  register(){
    
    if(this.registerGroup.status==='VALID')
    {
      if(this.VerCode===this.registerGroup.get("verifycode").value)
      {
          if(this.registerGroup.get("password").value==this.registerGroup.get("repassword").value)
          {
            var u=new user();
            u.email=this.registerGroup.get("email").value;
            u.useraccount=this.registerGroup.get("account").value;
            u.username=this.registerGroup.get("username").value;
            u.userpassword=this.registerGroup.get("password").value;
            this.common.registerUser(u,this.registerGroup.get("emailverifycode").value).subscribe((data)=>{
                  this.msg.info("注册成功");
                  this.router.navigate(["/home"]);
            },(err)=>{
              console.log(err);
            })
          }
          else{
            this.msg.error("两次输入的密码不一致");
          }
        
      }
      else
      {
        this.msg.error("验证码错误");
      }
    
    }
    else{
      if(this.registerGroup.get("email").errors!=null&&this.registerGroup.get("email").errors.email)
      {
          this.msg.error("邮箱格式错误");
      }
      else
      {
          this.msg.error("所有项都是必填的");
      }
    }

  }

  CheckVerCode(control:FormControl):any{
    if(this.VerCode===control.value){
      return null;
    }else{
      return {VerCode:true}
    }
  }
  
  
  selectAccount(){
      
  }

  selectUsername(value):Observable<any>{
    return this.common.selectUserByname(value)
  }

  userNameUniqueValidator(control:FormControl){

    // return control.valueChanges.pipe(debounceTime(3000),switchMap(()=>{
    //   return this.selectUsername(control.value);
    // }),map((res:any)=>{
    //   console.log(res);
    //   return res.status=='200'?null:{username:true}
    // }),catchError(err=>{console.log(err);return Observable.of({username:true})}),first())
     this.common.selectUserByname(control.value).subscribe((data:any)=>{
       return data.status=="200"?Observable.of(null):Observable.of({username:true});
     },(err)=>{
        return Observable.of({username:true});
     })
  }

  useraccountUniqueValidator(control:FormControl):Observable<any>{

    return control.valueChanges.pipe(debounceTime(3000),switchMap(()=>{
      
      return this.common.selectUserByaccount(control.value);
    }),map((res:any)=>{
      return res.status=='200'?null:{account:true}
    }),catchError(err=>{console.log(err);return Observable.of({account:true})}),first())
  }
}
