import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { user } from 'src/app/class/user';
import { StorgeService } from 'src/app/services/storge.service';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/Global.service';
import { NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  userinfo:user;

  loginname:any;

  loginpassword:any;

  loginDivVisible:boolean=false;

  validateForm: FormGroup;

  searchkey:any;

  authority:any;

  constructor(private fb: FormBuilder,private common:CommonService,private storge:StorgeService,private router:Router,private global:GlobalService,private msg:NzMessageService,private notice:NzNotificationService) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
    this.userinfo=this.getUserFromLocal();
    if(this.userinfo!=null&&this.userinfo)
    {
      this.common.sendUserInfo(this.userinfo);
    }
    else{
      this.common.sendUserInfo(null);
    }
  }

  showlogin(){
    this.loginDivVisible=true;
  }

  login(){
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    this.common.login(this.validateForm.get("userName").value,this.validateForm.get("password").value).subscribe((data)=>{
        if(data.status==="200")
        {
          for(var i=0;i<data.data.authorities.length;i++)
          {
            if(data.data.authorities[i].authority=='ADMIN'||data.data.authorities[i].authority=='SUPER ADMIN'){
              this.authority=data.data.authorities[i].authority;
              break;
            }else this.authority=data.data.authorities[i].authority;
          }
          this.setUserToLocal(data.data.user);
          this.loginDivVisible=false;
          this.userinfo=data.data.user;
          this.common.sendUserInfo(this.userinfo);
          this.router.navigateByUrl("home");
        }else if(data.status=='205')
        {
          this.notice.error("冻结通知","您的账号已被管理员冻结");
        }
        else {this.msg.error("密码错误")}
    },(err)=>{
          console.log(err);
    })
  }

  cancalLogin(){
    this.common.cancalLogin().subscribe((data)=>{
      if(data.status=="200"){
        this.common.sendUserInfo(null);
        this.userinfo=null;
        this.authority="";
        this.storge.removeSessionStorage("user");
        this.router.navigateByUrl("home");
      }
      else{
        console.log(data);
      }
    },(err)=>{
      console.log(err);
    })
  }

  setUserToLocal(u:user):user{
      var user=JSON.stringify(u);
      this.storge.setSessionStorage("user",user);
      return u;
  }

  getUserFromLocal():user{
    var user=this.storge.getSessionStorage("user")
    return JSON.parse(user);
  }

  cancal(){
    this.loginDivVisible=false;
  }

  search()
  {
    if(this.global.trim(this.searchkey)&&this.global.trim(this.searchkey)!="")
    {
      this.router.navigate(['/search',this.searchkey]);
      // this.global.sendSearchKey(this.searchkey);
       
    }
  }

  onKey(e:KeyboardEvent)
  {
    if(e.keyCode==13)
    {
      if(this.global.trim(this.searchkey)&&this.global.trim(this.searchkey)!="")
      {
        this.router.navigate(['/search',this.searchkey]);
        // this.global.sendSearchKey(this.searchkey);
         
      }
    }
  }

}
