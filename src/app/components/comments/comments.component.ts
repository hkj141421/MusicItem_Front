import { Component, OnInit, Input } from '@angular/core';
import { comment } from 'src/app/class/comment';
import { commentDetail } from 'src/app/class/commentDetail';
import { CommonService } from 'src/app/services/common.service';
import { CommentService } from 'src/app/services/comment.service';
import { NzMessageService } from 'ng-zorro-antd';
import { ActivatedRoute } from '@angular/router';
import { user } from 'src/app/class/user';
import { StorgeService } from 'src/app/services/storge.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

  inputValue:any;

  inputReply:any;

  commentid:number=0;

  commentCount:number;

  pageSize:number=20;

  pageIndex:number=1;

  replypageindex:number=1;

  @Input()
  id:number;
  
  @Input()
  commenttype:string;

  size:number=20;

  commentArray:Array<commentDetail>=[];

  userinfo:user;

  submitting:boolean=false;

  constructor(private commonService:CommonService,private commentService:CommentService,private msg:NzMessageService,private activRouter:ActivatedRoute,private storge:StorgeService) { }

  ngOnInit() {
    var user=this.storge.getSessionStorage("user");
    if(user!=null&&user)this.userinfo=JSON.parse(this.storge.getSessionStorage("user"));
    this.commonService.UserInfo.subscribe((data)=>{
        this.userinfo=data;
      }
    )
    this.loadComment(this.pageIndex);
  }

  loadComment(index){
    if(this.commenttype==="sheet"){
      this.commentService.getSheetComment(this.id,index,this.size).subscribe((data)=>{
        var jsonarray=data.data;
        this.commentArray=new Array<commentDetail>();
        for(var t=0;t<jsonarray.length;t++)
        {
          var com=new commentDetail();
          com.comment=jsonarray[t];
          this.commentArray.push(com);

        }
        this.commentService.countSheetComment(this.id).subscribe((data)=>{
          this.commentCount=data.data;
        },(err)=>{
          console.log(err)
        })
        
    },(err)=>{
      console.log(err);
    })
    }
    else if(this.commenttype==="music"){
      this.commentService.getMusicComment(this.id,index,this.size).subscribe((data)=>{
        var jsonarray=data.data;
        this.commentArray=new Array<commentDetail>();
        for(var t=0;t<jsonarray.length;t++)
        {
          var com=new commentDetail();
          com.comment=jsonarray[t];
          this.commentArray.push(com);

        }

        this.commentService.countMusicComment(this.id).subscribe((data)=>{
          this.commentCount=data.data
        },(err)=>{
          console.log(err)
        })
        
    },(err)=>{
      console.log(err);
    })
    }
    else if(this.commenttype==="track"){
      this.commentService.getTrackComment(this.id,index,this.size).subscribe((data)=>{
          var jsonarray=data.data;
          this.commentArray=new Array<commentDetail>();
          for(var t=0;t<jsonarray.length;t++)
          {
            var com=new commentDetail();
            com.comment=jsonarray[t];
            this.commentArray.push(com);

          }

          this.commentService.countTrackComment(this.id).subscribe((data)=>{
            this.commentCount=data.data
          },(err)=>{
            console.log(err)
          })
          
      },(err)=>{
        console.log(err);
      })
    }

  }
  
  addComment(){
    if(!this.userinfo||this.userinfo==null)
    {
        this.msg.info("发表评论前请先登录");
    }
    else if(this.inputValue!=""&&this.inputValue){
      var com=new commentDetail();
      if(this.commenttype==="sheet"){
        this.commentService.addSheetComment(this.id,this.inputValue).subscribe((data)=>{
          if(this.commentArray.length<20){
            com.comment=data.data;
            com.comment.userheadimg=this.userinfo.userheadimg;
            com.comment.username=this.userinfo.username;
            com.comment.count=0;
            this.commentArray.push(com);
          }
            
            this.inputValue="";
            this.commentCount++;
        },(err)=>{
            console.log(err);
        })
      }
      else if(this.commenttype==="music"){
        this.commentService.addMusicComment(this.id,this.inputValue).subscribe((data)=>{
            if(this.commentArray.length<20){
                com.comment=data.data;
                com.comment.userheadimg=this.userinfo.userheadimg;
                com.comment.username=this.userinfo.username;
                com.comment.count=0;
                this.commentArray.push(com);
                  }
          
                this.inputValue="";
                this.commentCount++;
        },(err)=>{
          console.log(err);
        })
      }
      else if(this.commenttype==="track"){
        this.commentService.addTrackComment(this.id,this.inputValue).subscribe((data)=>{
          if(this.commentArray.length<20){
            com.comment=data.data;
            com.comment.userheadimg=this.userinfo.userheadimg;
            com.comment.username=this.userinfo.username;
            com.comment.count=0;
            this.commentArray.push(com);
          }
          
          this.inputValue="";
          this.commentCount++;
        },(err)=>{
          console.log(err);
        })
      }
    }else{
        this.msg.info("评论内容不能为空")
    }
  }

  addReply(i){
    if(!this.userinfo||this.userinfo==null)
    {
        this.msg.info("发表评论前请先登录");
    }
    else if(this.commentArray[i].replyInput!=""&&this.commentArray[i].replyInput){
      var com=new comment();
      if(this.commenttype==="sheet"){
        this.commentService.addSheetReply(this.id,this.commentArray[i].replyInput,this.commentArray[i].comment.commentid).subscribe((data)=>{
            com=data.data;
            com.userheadimg=this.userinfo.userheadimg;
            com.username=this.userinfo.username;
            this.commentArray[i].replys.push(com);
            this.commentArray[i].comment.count++;
            this.commentArray[i].replyInput="";
        },(err)=>{
            console.log(err);
        })
      }
      else if(this.commenttype==="music"){
        this.commentService.addMusicReply(this.id,this.commentArray[i].replyInput,this.commentArray[i].comment.commentid).subscribe((data)=>{
    
          com=data.data;
          com.userheadimg=this.userinfo.userheadimg;
            com.username=this.userinfo.username;
          this.commentArray[i].replys.push(com);
          this.commentArray[i].comment.count++;
          this.commentArray[i].replyInput="";
        },(err)=>{
          console.log(err);
        })
      }
      else if(this.commenttype==="track"){
        this.commentService.addTrackReply(this.id,this.commentArray[i].replyInput,this.commentArray[i].comment.commentid).subscribe((data)=>{
  
          com=data.data;
          com.userheadimg=this.userinfo.userheadimg;
            com.username=this.userinfo.username;
          this.commentArray[i].replys.push(com);
          this.commentArray[i].comment.count++;
          this.commentArray[i].replyInput="";
        },(err)=>{
          console.log(err);
        })
      }
    }else{
      this.msg.info("回复内容不能为空");
    }
 
  }

  

  openReply(i){
    // var com=new comment();
    if(this.commenttype==="sheet"){
      this.commentService.getSheetReply(this.commentArray[i].comment.commentid,this.replypageindex,this.size).subscribe((data)=>{
        this.commentArray[i].replys=data.data;
      },(err)=>{
        console.log(err);
      })
    }
    else if(this.commenttype==="music"){
      this.commentService.getMusicReply(this.commentArray[i].comment.commentid,this.replypageindex,this.size).subscribe((data)=>{
        this.commentArray[i].replys=data.data;
      },(err)=>{
        console.log(err);
      })
    }
    else if(this.commenttype==="track"){
      this.commentService.getTrackReply(this.commentArray[i].comment.commentid,this.replypageindex,this.size).subscribe((data)=>{
        this.commentArray[i].replys=data.data;
      },(err)=>{
        console.log(err);
      })
    }
      this.commentArray[i].replyVisible=!this.commentArray[i].replyVisible;
  }

  likeReply(i,j){
    if(!this.userinfo||this.userinfo==null)
    {
        this.msg.info("发表评论前请先登录");
    }
    else {
      if(!this.commentArray[i].replys[j].likestate){
        this.commentArray[i].replys[j].fabulous++;
        this.commentArray[i].replys[j].likestate=true;
      }else{
        this.commentArray[i].replys[j].fabulous--;
        this.commentArray[i].replys[j].likestate=false;
      }
  
      if(this.commenttype==="sheet"){
          
          this.commentService.updateSheetCommentFabulous(this.commentArray[i].replys[j].commentid,this.commentArray[i].replys[j].fabulous).subscribe((data)=>{
              
          },(err)=>{
              console.log(err);
          })
      }
      else if(this.commenttype==="music"){
        this.commentService.updateMusicCommentFabulous(this.commentArray[i].replys[j].commentid,this.commentArray[i].replys[j].fabulous).subscribe((data)=>{
              
        },(err)=>{
            console.log(err);
        })
      }
      else if(this.commenttype==="track"){
        this.commentService.updateTrackCommentFabulous(this.commentArray[i].replys[j].commentid,this.commentArray[i].replys[j].fabulous).subscribe((data)=>{
              
        },(err)=>{
            console.log(err);
        })
      }
    }
  }

  likeComment(i){
    if(!this.userinfo||this.userinfo==null)
    {
        this.msg.info("发表评论前请先登录");
    }
    else{
      if(!this.commentArray[i].comment.likestate){
        this.commentArray[i].comment.fabulous++;
        this.commentArray[i].comment.likestate=true;
      }else{
        this.commentArray[i].comment.fabulous--;
        this.commentArray[i].comment.likestate=false;
      }
  
      if(this.commenttype==="sheet"){
          
        this.commentService.updateSheetCommentFabulous(this.commentArray[i].comment.commentid,this.commentArray[i].comment.fabulous).subscribe((data)=>{
            
        },(err)=>{
            console.log(err);
        })
    }
    else if(this.commenttype==="music"){
      this.commentService.updateMusicCommentFabulous(this.commentArray[i].comment.commentid,this.commentArray[i].comment.fabulous).subscribe((data)=>{
            
      },(err)=>{
          console.log(err);
      })
    }
    else if(this.commenttype==="track"){
      this.commentService.updateTrackCommentFabulous(this.commentArray[i].comment.commentid,this.commentArray[i].comment.fabulous).subscribe((data)=>{
            
      },(err)=>{
          console.log(err);
      })
    }
    }

  }

  changePage(){
    this.loadComment(this.pageIndex)
  }

}
