import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { track } from '../class/track';
import { GlobalConfigService} from '../config/global-config.service'

@Injectable({
  providedIn: 'root'
})
export class TrackService {

  constructor(private http:HttpClient) { }

  Addtrack(track:track):Observable<any>{
      var body=JSON.stringify({
        imgcontent1:track.imgcontent1,
        imgcontent2:track.imgcontent2,
        imgcontent3:track.imgcontent3,
        textcontent:track.textcontent
      });
      var header=new HttpHeaders().set('Content-Type','application/json;charset=UTF-8');
      return this.http.put("/api/user/track",body,{withCredentials:true,headers:header});
  }

  uploadimages(files:Array<any>):Observable<any>{
    const formData = new FormData();
      files.forEach((e)=>{
        formData.append("images",e);
      })
    return this.http.put("/api/user/track/images",formData,{withCredentials:true});
  }

  Addfollow(likeuserid:any):Observable<any>{
    var param=new HttpParams().set("likeuserid",likeuserid+"");
    return this.http.put("/api/user/fans",null,{withCredentials:true,params:param});
  }

  deletefollow(likeuserid:any):Observable<any>{
    var param=new HttpParams().set("likeuserid",likeuserid+"");
    return this.http.delete("/api/user/fans",{withCredentials:true,params:param});
  }

  loadTrackPage(pagenum:number):Observable<any>{
    var param=new HttpParams().set("pagenum",pagenum+"");
    return this.http.get("/api/track",{withCredentials:true,params:param})
  }

  loadPersonalTrackPage(pagenum:number,userid):Observable<any>{
    var param=new HttpParams().set("pagenum",pagenum+"").set("userid",userid);
    return this.http.get("/api/personal/track",{withCredentials:true,params:param})
  }

  updateTrackFabulous(fabulous:number,trackid:number):Observable<any>{
    var param=new HttpParams().set("fabulous",fabulous+"").set("trackid",trackid+"");
    return this.http.post("/api/track/fabulous",null,{withCredentials:true,params:param});
  }

  countSocialData(userid):Observable<any>{
    var param=new HttpParams().set("userid",userid)
    return this.http.get("/api/user/social/data",{withCredentials:true,params:param})
  }
}
