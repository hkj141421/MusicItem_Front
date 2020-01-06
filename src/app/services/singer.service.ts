import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { singer } from '../class/singer';
import { GlobalConfigService} from '../config/global-config.service'

@Injectable({
  providedIn: 'root'
})
export class SingerService {

  constructor(private http:HttpClient) { }

  loadRandomSinger(size):Observable<any>{
    var param=new HttpParams().set("size",size);
      return this.http.get("/api/singer/random",{withCredentials:true,params:param})
  }

  searchsinger(key,pagenum:number,size:number):Observable<any>
  {
    let param=new HttpParams().set("pagenum",pagenum+'').set("size",size+'').set("key",key);
    return this.http.get("/api/search/singer",{withCredentials:true,params:param})
  }

  CountSearchsingerc(key):Observable<any>
  {
    let param=new HttpParams().set("key",key);
    return this.http.get("/api/search/singer/pagecount",{withCredentials:true,params:param})
  }

  getSingerByid(id):Observable<any>
  {
    let param=new HttpParams().set("id",id);
    return this.http.get("/api/singer",{withCredentials:true,params:param})
  }

  getSingerOfAlbum(name):Observable<any>
  {
    let param=new HttpParams().set("name",name);
    return this.http.get("/api/singer/album",{withCredentials:true,params:param})
  }

  getMusicFromAlbum(album):Observable<any>
  {
    let param=new HttpParams().set("album",album);
    return this.http.get("/api/singer/album/music",{withCredentials:true,params:param})
  }

  getAllSinger(pagenum,size):Observable<any>
  {
    let param=new HttpParams().set("pagenum",pagenum).set("size",size);
    return this.http.get("/api/backstage/singer",{withCredentials:true,params:param})
  }

  getAllSingerCount():Observable<any>
  {
    return this.http.get("/api/backstage/singer/count",{withCredentials:true})
  }

  updateAllColumData(s:singer):Observable<any>
  {
    var body=JSON.stringify({
      singerid:s.singerid,
      singerimg:s.singerimg,
      singersex:s.singersex,
      singerhotnumber:s.singerhotnumber,
      alias:s.alias,
      albumsize:s.albumsize,
      briefdesc:s.briefdesc,
     });
    var header=new HttpHeaders().set('Content-Type','application/json;charset=UTF-8');
    return this.http.post("/api/backstage/singer",body,{responseType:'json',withCredentials:true,headers:header});
  }

}
