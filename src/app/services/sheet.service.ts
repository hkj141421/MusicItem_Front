import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { sheet } from '../class/sheet';

@Injectable({
  providedIn: 'root'
})
export class SheetService {

  constructor(private http:HttpClient) { }

  getSheetByuserId(id:Number,username):Observable<any>{
    //通过用户id获得用户所有歌单信息
    var param=new HttpParams().set("username",username);
    return this.http.get("http://localhost:1122/api/songsheet/user/"+id,{responseType:'json',params:param,withCredentials:true});
  }

  createSheet(sheet:sheet):Observable<any>{
    //创建歌单
    var body=JSON.stringify({songsheetname:sheet.songsheetname,
                             type:"["+sheet.type.toString()+"]",
                             introduce:sheet.introduce
                            });
    var header=new HttpHeaders().set('Content-Type','application/json;charset=UTF-8');
    
    return this.http.put("http://localhost:1122/api/user/songsheet",body,{responseType:'json',withCredentials:true,headers:header});
  }

  getSheetBysheetId(id:Number):Observable<any>{
    //通过sheetid获得歌单信息
    return this.http.get("http://localhost:1122/api/songsheet/info/"+id,{responseType:'json',withCredentials:true});
  }

  getSheetBysheetIdAndUserid(id:Number,userid:any):Observable<any>{
    //通过sheetid获得歌单信息
    var param;
    if(userid)param=new HttpParams().set("userid",userid+'');
    else param=param=new HttpParams();
    return this.http.get("http://localhost:1122/api/songsheet/info/"+id,{responseType:'json',withCredentials:true,params:param});
  }

  getMusicBysheetId(id:Number,pagenumber:number,size:number):Observable<any>{
    //通过sheetid获得歌单中的音乐信息
 
    return this.http.get("http://localhost:1122/api/songsheet/"+id+"?pagenumber="+pagenumber+"&size="+size,{responseType:'json',withCredentials:true});
  }

  collectSheet(sheetid:Number):Observable<any>{
      var param=new HttpParams().set('sheetid',sheetid+'');
      return this.http.put("http://localhost:1122/api/user/collection/sheet",null,{withCredentials:true,params:param})
  }

  getSheetBytype(type,pagenumber,size):Observable<any>
  {
    var param=new HttpParams().set('type',type).set('pagenum',pagenumber).set('size',size);
    return this.http.get("http://localhost:1122/api/search/sheet",{withCredentials:true,params:param})
  }

  getRecommendSheet(pagenumber,size):Observable<any>
  {
    var param=new HttpParams().set('pagenum',pagenumber).set('size',size);
    return this.http.get("http://localhost:1122/api/recommend/sheet",{withCredentials:true,params:param})
  }

  getUserSheet(userid,username):Observable<any>
  {
    var param=new HttpParams().set('userid',userid).set('username',username);
    return this.http.get("http://localhost:1122/api/user/creatsheet",{withCredentials:true,params:param})
  }

  getsheetpage(pagenum,size,type):Observable<any>
  {
    var param=new HttpParams().set('pagenum',pagenum).set('size',size).set('type',type);
    return this.http.get("http://localhost:1122/api/sheet/type",{withCredentials:true,params:param})
  }

  getsheetCount(type):Observable<any>
  {
    var param=new HttpParams().set('type',type);
    return this.http.get("http://localhost:1122/api/sheet/type/count",{withCredentials:true,params:param})
  }

  searchsheet(key,pagenum:number,size:number):Observable<any>
  {
    let param=new HttpParams().set("pagenum",pagenum+'').set("size",size+'').set("key",key);
    return this.http.get("http://localhost:1122/api/search/sheet",{withCredentials:true,params:param})
  }

  CountSearchsheet(key):Observable<any>
  {
    let param=new HttpParams().set("key",key);
    return this.http.get("http://localhost:1122/api/search/sheet/pagecount",{withCredentials:true,params:param})
  }

  getAllSheet(pagenum,size):Observable<any>
  {
    let param=new HttpParams().set("pagenum",pagenum).set("size",size);
    return this.http.get("http://localhost:1122/api/backstage/sheet",{withCredentials:true,params:param})
  }

  getAllSheetCount():Observable<any>
  {
    return this.http.get("http://localhost:1122/api/backstage/sheet/count",{withCredentials:true})
  }

  updateAllColumData(s:sheet):Observable<any>
  {
    var body=JSON.stringify({
      sheetid:s.sheetid,
      songsheetname:s.songsheetname,
      type:s.type,
      coverimg:s.coverimg,
      producer:s.producer,
      state:s.state,
      time:s.time,
      introduce:s.introduce
     });
    var header=new HttpHeaders().set('Content-Type','application/json;charset=UTF-8');
    return this.http.post("http://127.0.0.1:1122/api/backstage/sheet",body,{responseType:'json',withCredentials:true,headers:header});
  }
}
