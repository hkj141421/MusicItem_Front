import { Injectable } from '@angular/core';
import { HttpClient ,HttpParams, HttpHeaders} from '@angular/common/http'; 
import { Observable } from 'rxjs/Observable';
import { music } from '../class/music';

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  constructor(private http:HttpClient) { }

  requestLrc(lrcid):Observable<any>{
    return this.http.get("http://localhost:1122/api/lyrics/"+lrcid,{responseType:'json',withCredentials:true});
  }

  getSongList(sheetid,pagenumber:number,size:number):Observable<any>{
    return this.http.get("http://127.0.0.1:1122/api/songsheet/"+sheetid+"?pagenumber="+pagenumber+"&size="+size,{responseType:'json',withCredentials:true});
}
  collectSong(musicid,sheetid):Observable<any>{
    var body=JSON.stringify({
      musicid:musicid,
      sheetid:sheetid
     });
    var header=new HttpHeaders().set('Content-Type','application/json;charset=UTF-8');
    return this.http.put("http://127.0.0.1:1122/api/user/sheet/music",body,{responseType:'json',withCredentials:true,headers:header});
  }
  downloadMusic(musicid){
   // this.http.get("http://127.0.0.1:1122/user/music/"+musicid).subscribe((data)=>{},(err)=>{console.log();alert("下载失败，具体原因请查看控制台")});
  }

  login(username,password):Observable<any>{
    let reqbody=new HttpParams().set("username",username).set("password",password);
    return this.http.post("http://127.0.0.1:1122/login",reqbody,{observe:"response",withCredentials:true});
  }
  logout():Observable<any>{
    let reqbody=new HttpParams();//.set("username",username).set("password",password);
    return this.http.post("http://127.0.0.1:1122/logout",reqbody,{withCredentials:true});
  }

  foolwer(id){ 
   /* let reqbody=new HttpParams();
    let reqHead;
    if(this.common.getLocalStorage("Authorization")!=null){
      reqHead=new HttpHeaders().set("Authorization",this.common.getLocalStorage("Authorization"));
    }
    else{
      reqHead=new HttpHeaders();
    }
    return this.http.post("http://127.0.0.1:1122/user/"+id,reqbody,{headers:reqHead,withCredentials:true});
    */
  }

  getMusicInfoByid(musicid):Observable<any>{
     return this.http.get("http://localhost:1122/api/music/"+musicid,{withCredentials:true});
  }

  getTheNewestMusic(pagenum:number,size:number):Observable<any>
  {
    let param=new HttpParams().set("offset",pagenum+'').set("size",size+'');
    return this.http.get("http://localhost:1122/api/newmusic",{withCredentials:true,params:param})
  }

  getBandList(pagenum,size,type):Observable<any>
  {
    let param=new HttpParams().set("pagenum",pagenum+'').set("size",size+'').set("type",type);
    return this.http.get("http://localhost:1122/api/musicband",{withCredentials:true,params:param})
  }

  getRecommendMusic(tags):Observable<any>
  {
      let param;
      if(tags)param=new HttpParams().set("musicpreference",tags);
      else param=new HttpParams();
      return this.http.get("http://localhost:1122/api/recommend/music",{withCredentials:true,params:param})
  }

  searchmusic(key,pagenum:number,size:number):Observable<any>
  {
    let param=new HttpParams().set("pagenum",pagenum+'').set("size",size+'').set("key",key);
    return this.http.get("http://localhost:1122/api/search/music",{withCredentials:true,params:param})
  }

  CountSearchmusic(key):Observable<any>
  {
    let param=new HttpParams().set("key",key);
    return this.http.get("http://localhost:1122/api/search/music/pagecount",{withCredentials:true,params:param})
  }

  getAllMusic(pagenum,size):Observable<any>
  {
    let param=new HttpParams().set("pagenum",pagenum).set("size",size);
    return this.http.get("http://localhost:1122/api/backstage/music",{withCredentials:true,params:param})
  }

  getAllMusicCount():Observable<any>
  {
    return this.http.get("http://localhost:1122/api/backstage/music/count",{withCredentials:true})
  }

  updateAllColumData(m:music):Observable<any>
  {
    var body=JSON.stringify({
      musicid:m.musicid,
      musicname:m.musicname,
      singer:m.singer,
      playnumber:m.playnumber,
      time:m.time,
      type:m.type,
      album:m.album,
      language:m.language,
      lyricid:m.lyricid,
      musicaddress:m.musicaddress,
      musicimg:m.musicimg,
      creationdate:m.creationdate
     });
    var header=new HttpHeaders().set('Content-Type','application/json;charset=UTF-8');
    return this.http.post("http://127.0.0.1:1122/api/backstage/music",body,{responseType:'json',withCredentials:true,headers:header});
  }

}
