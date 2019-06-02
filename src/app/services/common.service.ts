import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders,HttpRequest, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { user } from '../class/user';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public UserInfo:EventEmitter<user>=new EventEmitter();

  public search:EventEmitter<string>=new EventEmitter();

  constructor(private http:HttpClient) { }

  handleUpload(file): Observable<any> {
    const formData = new FormData();
      formData.append('file', file);
    return this.http.put("http://localhost:1122/api/user/info/images",formData,{withCredentials:true});
  }

  handleUploadTrackImage(file): Observable<any> {
    const formData = new FormData();
      formData.append('images', file);
    return this.http.put("http://localhost:1122/api/user/track/images",formData,{withCredentials:true});
  }

  deleteUploadFile(paths:string): Observable<any>
  {
    var head=new HttpHeaders().set("Content-Type","application/json");
    return this.http.delete("http://localhost:1122/api/upload/file",{withCredentials:true,headers:head,params:{imagespath:paths}})
  }

  updateUserInfo(user:user): Observable<any>{
    var body=JSON.stringify({
      signature:user.signature,
      birthday:user.birthday,
      location:user.location,
      sex:user.sex,
      musicpreference:user.musicpreference
     });
     var head=new HttpHeaders().set("Content-Type","application/json");
     return this.http.post("http://localhost:1122/api/user/info",body,{withCredentials:true,headers:head});
  }

  getUserInfo(userid):Observable<any>{
    var params=new HttpParams().set("userid",userid);
    return this.http.get("http://localhost:1122/api/user/info",{withCredentials:true,params:params});
  }

  sendEmailCode(email){//发送邮件验证码
    var params=new HttpParams().set("email",email);
    return this.http.get("http://localhost:1122/api/email/verificationcode",{withCredentials:true,params:params});
  }

  saveEmail(email,code):Observable<any>{//修改邮箱
    var params=new HttpParams().set("email",email).set("code",code);
    return this.http.post("http://localhost:1122/api/user/info/email",null,{withCredentials:true,params:params});
  }

  checkEmailCode(code){
    var params=new HttpParams().set("code",code);
    return this.http.post("http://localhost:1122/api/emailCode",null,{withCredentials:true,params:params});
  }

  changepwd(newpwd,oldpwd):Observable<any>{
    var params=new HttpParams().set("newpwd",newpwd).set("oldpwd",oldpwd);
      return this.http.post("http://localhost:1122/api/user/info/pwd",null,{params:params,withCredentials:true});
  }

  getTime():any{
    var date=new Date();
    var year=date.getFullYear();
    var month;
    var day;
    var hours;
    var min;
    var s;
    if((date.getMonth()+1)<10)month="0"+(date.getMonth()+1);
    else month=date.getMonth()+1

    if(date.getDate()<10)day="0"+date.getDate();
    else day=date.getDate();

    if(date.getHours()<10)hours="0"+date.getHours();
    else hours=date.getHours();

    if(date.getMinutes()<10)min="0"+date.getMinutes();
    else min=date.getMinutes()

    if(date.getSeconds()<10)s="0"+date.getSeconds();
    else s=date.getSeconds();
    return year+"-"+month+"-"+day+" "+hours+":"+min+":"+s;
  }

  checkVeriCode(code):Observable<any>{
    var param=new HttpParams().set("code",code)
    return this.http.post("http://localhost:1122/api/VerifyCode",null,{withCredentials:true,params:param})
  }

  getVeriCode():Observable<any>{
    return this.http.get("http://localhost:1122/api/VerifyCode",{withCredentials:true})
  }

  registerUser(user:user,emailverifycode:any):Observable<any>{
      // var body=JSON.stringify({
      //   email:user.email,
      //   useraccount:user.useraccount,
      //   username:user.username,
      //   password:user.userpassword,
      //   emailverifycode:emailverifycode
      // })
      var param=new HttpParams().set("email",user.email)
                                .set("useraccount",user.useraccount)
                                .set("username",user.username)
                                .set("password",user.userpassword)
                                .set("emailverifycode",emailverifycode)
      var head=new HttpHeaders().set("Content-Type","application/json");
      return this.http.put("http://localhost:1122/api/newuser",null,{withCredentials:true,headers:head,params:param});
  }

  login(username,password):Observable<any>{
    var param=new HttpParams()
    .set("password",password)
    .set("username",username)
    var head=new HttpHeaders().set("Content-Type","application/json");
    return this.http.post("http://localhost:1122/login",null,{withCredentials:true,headers:head,params:param});
  }

  selectUserByname(name):Observable<any>{
    var param=new HttpParams()
    .set("username",name)
    return this.http.get("http://localhost:1122/api/Verify/username",{withCredentials:true,params:param});
  }

  selectUserByaccount(account):Observable<any>{
    var param=new HttpParams()
    .set("account",account)
    return this.http.get("http://localhost:1122/api/Verify/account",{withCredentials:true,params:param});
  }

  cancalLogin():Observable<any>{
    return this.http.post("http://localhost:1122/logout",null,{withCredentials:true})
  }

  sendUserInfo(u:user){
    this.UserInfo.emit(u);
  }

  sendSearch(s:any){
    this.search.emit(s);
  }

  searchuser(key,pagenum:number,size:number):Observable<any>
  {
    let param=new HttpParams().set("pagenum",pagenum+'').set("size",size+'').set("key",key);
    return this.http.get("http://localhost:1122/api/search/user",{withCredentials:true,params:param})
  }

  CountSearchuser(key):Observable<any>
  {
    let param=new HttpParams().set("key",key);
    return this.http.get("http://localhost:1122/api/search/user/pagecount",{withCredentials:true,params:param})
  }

  getRecommenduser(userid):Observable<any>
  {
    let param;
    if(userid)param=new HttpParams().set("userid",userid);
    else param=new HttpParams();
    return this.http.get("http://localhost:1122/api/recommend/user",{withCredentials:true,params:param})
  }

  getAlluser(pagenum,size):Observable<any>
  {
    let param=new HttpParams().set("pagenum",pagenum).set("size",size);
    return this.http.get("http://localhost:1122/api/backstage/user",{withCredentials:true,params:param})
  }

  getAlluserCount():Observable<any>
  {
    return this.http.get("http://localhost:1122/api/backstage/user/count",{withCredentials:true})
  }

  updateAllColumData(userid,status):Observable<any>
  {
    console.log(userid+","+status)
    var param=new HttpParams().set("status",status).set("userid",userid);
    return this.http.post("http://localhost:1122/api/backstage/user",null,{withCredentials:true,params:param})
  }

  BatchDelete(list:Array<any>,type):Observable<any>
  {
      var json=JSON.stringify(list,type);
      var head=new HttpHeaders().set("Content-Type","application/json");
      // var param=new HttpParams()
      //          .set("list[]",json)
      //          .set("type",type);
      return this.http.delete("http://localhost:1122/api/backstage/batch/data",{withCredentials:true,params:{list,type},headers:head})
  }
}
