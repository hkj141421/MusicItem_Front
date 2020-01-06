import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GlobalConfigService} from '../config/global-config.service'

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http:HttpClient) { }

  addSheetComment(sheetid:number,content:string):Observable<any>{
    var param=new HttpParams().set("content",content);
      return this.http.put("/api/user/songsheet/comment/"+sheetid,null,{withCredentials:true,params:param});
  }

  addSheetReply(sheetid:number,content:string,commentid:number):Observable<any>{
    var param=new HttpParams().set("content",content).set("sheetid",sheetid+"");
    return this.http.put("/api/user/songsheet/reply/"+commentid,null,{withCredentials:true,params:param});  
  }

  updateSheetCommentFabulous(commentid:number,fabulous:number):Observable<any>{
    var param=new HttpParams().set("fabulous",fabulous+"").set("commentid",commentid+"");
    return this.http.post("/api/user/songsheet/comment/fabulous",null,{withCredentials:true,params:param})
  }

  getSheetComment(sheetid:number,pagenumber:number,size:number):Observable<any>{
      return this.http.get("/api/songsheet/comment/"+sheetid+"?pagenumber="+pagenumber+"&size="+size,{withCredentials:true});
  }

  getSheetReply(commentid:number,pagenumber:number,size:number):Observable<any>{
      return this.http.get("/api/songsheet/reply/"+commentid+"?pagenumber="+pagenumber+"&size="+size,{withCredentials:true});
  }


  addMusicComment(muiscid:number,content:string):Observable<any>{
    var param=new HttpParams().set("content",content);
      return this.http.put("/api/user/music/comment/"+muiscid,null,{withCredentials:true,params:param});
  }

  addMusicReply(musicid:number,content:string,commentid:number):Observable<any>{
    var param=new HttpParams().set("content",content).set("musicid",musicid+"");

    return this.http.put("/api/user/music/reply/"+commentid,null,{withCredentials:true,params:param});  
  }

  updateMusicCommentFabulous(commentid:number,fabulous:number):Observable<any>{
    var param=new HttpParams().set("fabulous",fabulous+"").set("commentid",commentid+"");

    return this.http.post("/api/user/music/comment/fabulous",null,{withCredentials:true,params:param})
  }

  getMusicComment(musicid:number,pagenumber:number,size:number):Observable<any>{
      return this.http.get("/api/music/comment/"+musicid+"?pagenumber="+pagenumber+"&size="+size,{withCredentials:true});
  }

  getMusicReply(commentid:number,pagenumber:number,size:number):Observable<any>{
      return this.http.get("/api/music/reply/"+commentid+"?pagenumber="+pagenumber+"&size="+size,{withCredentials:true});
  }


  addTrackComment(trackid:number,content:string):Observable<any>{
    var param=new HttpParams().set("content",content);

      return this.http.put("/api/user/track/comment/"+trackid,null,{withCredentials:true,params:param});
  }

  addTrackReply(trackid:number,content:string,commentid:number):Observable<any>{
    var param=new HttpParams().set("content",content).set("trackid",trackid+"");
    return this.http.put("/api/user/track/reply/"+commentid,null,{withCredentials:true,params:param});  
  }

  updateTrackCommentFabulous(commentid:number,fabulous:number):Observable<any>{
    var param=new HttpParams().set("fabulous",fabulous+"").set("commentid",commentid+"");

    return this.http.post("/api/user/track/comment/fabulous",null,{withCredentials:true,params:param})
  }

  getTrackComment(trackid:number,pagenumber:number,size:number):Observable<any>{
      return this.http.get("/api/track/comment/"+trackid+"?pagenumber="+pagenumber+"&size="+size,{withCredentials:true});
  }

  getTrackReply(commentid:number,pagenumber:number,size:number):Observable<any>{
      return this.http.get("/api/track/reply/"+commentid+"?pagenumber="+pagenumber+"&size="+size,{withCredentials:true});
  }

  countSheetComment(sheetid):Observable<any>{
    return this.http.get("/api/songsheet/comment/count/"+sheetid,{withCredentials:true});
  }

  countMusicComment(musicid):Observable<any>{
    return this.http.get("/api/music/comment/count/"+musicid,{withCredentials:true});
  }
  countTrackComment(trackid):Observable<any>{
    return this.http.get("/api/track/comment/count/"+trackid,{withCredentials:true});
  }
}
