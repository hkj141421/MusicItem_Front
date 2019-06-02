import { Component, OnInit,ElementRef,Renderer2,ViewChild, ViewChildren,QueryList, Input,SimpleChanges} from '@angular/core';
import { HttpClient ,HttpParams} from '@angular/common/http'; 
import { MusicService } from '../../services/music.service';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { music } from 'src/app/class/music';
import { NzMessageService } from 'ng-zorro-antd';
import { GlobalService } from 'src/app/services/Global.service';
import { sheet } from 'src/app/class/sheet';
import { SheetService } from 'src/app/services/sheet.service';
import { StorgeService } from 'src/app/services/storge.service';

@Component({
  selector: 'app-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.css']
})
export class AudioComponent implements OnInit {

  constructor(private render:Renderer2,private Mservice:MusicService,private msg:NzMessageService,private globalService:GlobalService,private sheetService:SheetService,private musicService:MusicService,private storge:StorgeService) { }

  AudioPlay:HTMLAudioElement;/**播放器元素 */

  test:any;

  @ViewChild('Audio')
  Audio:ElementRef;/**播放器界面 */

  @ViewChild('playControllerbtn')
  playBtn:ElementRef;/**播放按钮 */

  @ViewChild('lock')
  lock:ElementRef;/**播放器锁元素 */

  @ViewChild('SongList')
  SongList:ElementRef;/**歌单按钮 */

  @ViewChild('sequence')
  sequence:ElementRef;/**播放顺序按钮 */

  @ViewChild("Audio_Volumediv")
  Volumediv:ElementRef/**调节音量视图 */

  @ViewChild("Audio_VolumeBar")
  Volumescroll:ElementRef;/**最大音量条 */

  @ViewChild("Volume_Bar")
  Volumebar:ElementRef;/**红色音量滑动条 */

  @ViewChild("Volume_Btn")
  Volumeblock:ElementRef;/**音量滑块 */

  @ViewChild("Audio_Progressbar")
  Speedscroll:ElementRef;/**音乐最大进度条 */

  @ViewChild("Bar")
  Speedbar:ElementRef;/**当前播放进度条 */

  @ViewChild("Progress_Btn")
  Speedblock:ElementRef;/**进度调节滑块 */

  @ViewChild("lrcView")
  lrcView:ElementRef;/**歌词显示视图 */

  // @ViewChildren("lrcLine")
  lrcline:any;/**所有歌词行 */

  @ViewChildren("songtr")
  SongLine:QueryList<any>;/**所有歌曲行 */
 
  @Input()
  Songlist:Array<any>=new Array();

  @Input()
  music:any;

  Speedvalue:number=0;/**当前进度条长度 */

  Interval:any;/**定时器对象 */

  SongCurrentTime:any="00:00";/**歌曲当前播放时间时间 */

  sequenceflag:number=1;/**播放顺序，1列表循环，2单曲循环，3随机 */

  Lrctext:Array<any>=new Array();/**歌词文本 */

  Lrctime:Array<any>=new Array();/**歌词时间 */

  SongArray:Array<music>=new Array();/**歌曲数组 */

  index:number=0;/**正在播放的歌曲在数组中的序号 */

  lastindex:number=0;/**上一首播放的歌曲序号 */

  SongCount:number=0;/**歌曲数量 */

  playflag:number=0;/**播放状态 */

  lockflag:boolean=false;/**播放器是否被锁定，默认未锁定 */

  SongListflag:boolean=false;/**歌单显示状态，默认隐藏 */

  Volumeflag:boolean=false;/**音量视图是否显示标记 */

  Volumevalue:number=0;/**音量滑块高度 */

  CurrentSongInfo:music;/**当前播放的音乐信息 */

  CurrentLrcLine:any=0;/**当前播放的歌词高亮行 */

  lastLrcLine:any=0;/**上一行歌词 */

  ViewUpDownFlag:boolean=false;//播放器视图升起降下状态


  ngOnInit() {
   this.AudioInit(); 
  //  this.SongLine=document.getElementsByClassName("SongTable")[0].getElementsByTagName("tr");/**获得所有的歌曲行元素 */
   /**设置当前播放歌曲的样式 */
  }
  ngAfterViewInit(){
    /**获得所有的歌词元素 */
    this.lrcline=this.lrcView.nativeElement.getElementsByTagName("li");
        /**设置当前播放歌曲行 */       
  }
  ngOnChanges(changes: SimpleChanges) {
    var Songlist=changes["Songlist"].currentValue
    for (let i in Songlist) {  
      this.SongArray.push(Songlist[i])
    }
    this.CurrentSongInfo=changes["music"].currentValue;
    if(this.CurrentSongInfo!=null){
      this.showLRC(this.CurrentSongInfo.lyricid);
      
      this.render.setAttribute(this.AudioPlay,"src",this.CurrentSongInfo.musicaddress);
    }
   // console.log(this.CurrentSongInfo);

  }


  AudioInit(){/**初始化播放器属性 */
    /**创建播放器 */
    this.AudioPlay=this.render.createElement("audio");
    this.render.setAttribute(this.AudioPlay,"preload","auto");
    this.AudioPlay
    /**设置歌曲播放完毕事件 */
    var that=this;
    this.AudioPlay.onended=function(){
      clearInterval(that.Interval);
      that.CurrentLrcLine=0;
      /**自动播放下一首 */
      if(that.SongArray.length>1){
        that.SongSequence();/**根据播放顺序选择下一首歌曲 */
      }else{
        that.playflag=1;
        that.Play();
      }
    }
    /**设置歌曲播放事件 */
    this.AudioPlay.ontimeupdate =function(){
      if(that.Lrctext!=null){
        that.synLrc();
      }
      // var time= that.AudioPlay.buffered;
      // var t=time.end(time.length-1)/that.AudioPlay.duration;
      // that.test="已缓存"+t;
    }

    this.AudioPlay.onerror=function(){
      var error = that.AudioPlay.error;
      console.log(error)
        switch (error.code){
            case 1:
                that.msg.error('取回过程被用户中止。');

            case 2:
                
                that.msg.error('下载时发生错误。');
                break;
            case 3:
                that.msg.error('解码时发生错误。');
                break;
            case 4:
                that.msg.error('媒体不可用或者不支持音频/视频。');
                break;
        }
    }
    this.loadMusicFromExternal();
  }

  LOCK(){/**控制播放器界面的显示 */
    this.lockflag=!this.lockflag;
  }
  //控制歌单升起降下
  ControlAudioView(){
    this.ViewUpDownFlag=!this.ViewUpDownFlag;
  }
  ShowSongList(){/**控制显示歌单列表 */
    this.SongListflag=!this.SongListflag;
    
  }

  closeSonglist(){/**关闭歌单视图 */
      this.SongListflag=false;
  }

  ChangeSequence(){/**修改播放顺序 */
    
     this.sequenceflag++;
     if(this.sequenceflag>3)this.sequenceflag=1;
  }

  showLRC(lrcid){/**获取歌词信息 */

    this.Mservice.requestLrc(lrcid).subscribe(
      (data)=>{this.Lrctime=data.data[0];this.Lrctext=data.data[1];this.parseLrctime();}
      ,(err)=>{console.log(err);this.Lrctime=null;this.Lrctext=null;});
    
  }

  Play(){/**控制音乐是否播放 */
      switch (this.playflag){
        case 0:{
          this.AudioPlay.play();
          this.showLRC(this.CurrentSongInfo.lyricid);
          // alert(this.AudioPlay.duration);
          /**定时移动进度条 */
          clearInterval(this.Interval);
          this.setIntervalSongpro();
          this.playflag=1;
        }break;
        case 1:{
          this.AudioPlay.pause();
          this.playflag=0;
          clearInterval(this.Interval);
        }
    }
  }

  ControllerVolume($event){/**调节音量 */
    var UpVal =536;
    var that = this;
     // 拖动一定写到 down 里面才可以
    //  alert($event.clientY);
   
    document.onmousemove = function(e){      
      // var event = event || window.event;
      that.Volumevalue = UpVal - e.clientY;  
      that.ViewUpDownFlag=true;
      if(that.Volumevalue < 0){
        that.Volumevalue = 0;   
      }
      else if(that.Volumevalue > that.Volumescroll.nativeElement.offsetHeight - that.Volumeblock.nativeElement.offsetHeight){
        that.Volumevalue = (that.Volumescroll.nativeElement.offsetHeight - that.Volumeblock.nativeElement.offsetHeight)+5; 
      }
      // that.Volumebar.style.height = (that.Volumevalue+9) +'px' ;
      // that.Volumebar.style.top = (that.Volumevalue)*-1 + "px";
      that.render.setStyle(that.Volumebar.nativeElement,"height",that.Volumevalue+9+"px");
      that.render.setStyle(that.Volumeblock.nativeElement,"top",(that.Volumevalue)*-1 + "px");
      that.AudioPlay.volume=((that.Volumevalue-9)/88);
      //防止选择内容--当拖动鼠标过快时候，弹起鼠标，bar也会移动，修复bug
      window.getSelection ? window.getSelection().removeAllRanges() : document.getSelection().empty();
    }
    document.onmouseup = function(){
      document.onmousemove = null; //弹起鼠标不做任何操作
      that.ViewUpDownFlag=false;
    }
  }

  ShowVolumediv(){/**显示音量条 */
    this.Volumeflag=!this.Volumeflag;
  }

  Controllersong($event){/**调节歌曲进度 */
    // var event = event || window.event;
  var leftVal =426;
  var that = this;
  var flag=true; 
  /**点击时清除计时器 */
  clearInterval(that.Interval);
   // 拖动一定写到 down 里面才可以
  document.onmousemove = function(e){
    // var event = event || window.event; 
    that.Speedvalue = e.clientX - leftVal; 
    
    if(that.Speedvalue < 0)
      {that.Speedvalue = 0;
      }
    else if(that.Speedvalue > that.Speedscroll.nativeElement.offsetWidth - that.Speedblock.nativeElement.offsetWidth)
      {that.Speedvalue = that.Speedscroll.nativeElement.offsetWidth - that.Speedblock.nativeElement.offsetWidth;
    }
    that.render.setStyle(that.Speedbar.nativeElement,"width",that.Speedvalue+3+"px");
    that.render.setStyle(that.Speedblock.nativeElement,"left",that.Speedvalue+"px");
    
    //防止选择内容--当拖动鼠标过快时候，弹起鼠标，bar也会移动，修复bug
    window.getSelection ? window.getSelection().removeAllRanges() : document.getSelection().empty();
  }

  document.onmouseup = function(){
    document.onmousemove = null; //弹起鼠标不做任何操作
    if(flag){
      that.AudioPlay.currentTime=Math.round(((that.Speedvalue/528)*that.AudioPlay.duration)*1000)/1000;
      that.isCurrentLine();
      that.setIntervalSongpro();
      flag=false;
    }
   
  }
  }

  setIntervalSongpro(){/**移动歌曲进度条 */
    
    this.Interval=setInterval(()=>{
      if(this.AudioPlay.currentTime<this.AudioPlay.duration){
        this.SongCurrentTime=this.updateCurrentTime(this.AudioPlay.currentTime);
        this.render.setStyle(this.Speedbar.nativeElement,"width",this.AudioPlay.currentTime*(528/this.AudioPlay.duration)+3+"px");
        this.render.setStyle(this.Speedblock.nativeElement,"left",this.AudioPlay.currentTime*(525/this.AudioPlay.duration)+"px");
      }
    },1);
  }

  updateCurrentTime(currentTime):any{/**获取当前播放时间 */
    var s=currentTime%60;
    var m=currentTime/60;
    var time;
    if(s==0)time="00:00";
    else if(m<1){
      if(s<10){
        time="00:0"+(s+"").substring(0,(s+"").indexOf('.'));
      }else{
        time="00:"+(s+"").substring(0,(s+"").indexOf('.'));
      }
    }else if(m<10){
      if(s<10){
        time="0"+(m+"").substring(0,1)+":0"+(s+"").substring(0,(s+"").indexOf('.'));
      }else{
        time="0"+(m+"").substring(0,1)+":"+(s+"").substring(0,(s+"").indexOf('.'));
      }
    }else{
      if(s<10){
        time=(m+"").substring(0,2)+":0"+(s+"").substring(0,(s+"").indexOf('.'));
      }else{
        time=(m+"").substring(0,2)+":"+(s+"").substring(0,(s+"").indexOf('.'));
      }
    }
    return time;
    

  }

  SongSequence(){ /**播放顺序，1列表循环，2单曲循环，3随机 */

    switch(this.sequenceflag){
      case 1:{
        this.lastindex=this.index;
        this.index++;
        this.setCurrentSongLine();
        this.listloop();
      }break;
      case 2:{
        this.listloop();
      }break;
      case 3:{
        this.listrandom();
      }break;
    }
  }

  listloop(){/**实现列表循环,调用前应对index进行操作实现切换歌曲 */
    if(this.index<0){this.index=this.SongArray.length-1;console.log("<0")}
    else if(this.index>(this.SongArray.length-1)){this.index=0;}
    this.setCurrentSongLine(); 
    this.CurrentSongInfo=this.SongArray[this.index];
    this.render.setAttribute(this.AudioPlay,"src",this.SongArray[this.index].musicaddress); 
    clearInterval(this.Interval);
    this.setIntervalSongpro();
    this.playflag=0;
    this.showLRC(this.CurrentSongInfo.lyricid);
    this.Play();
  }

  listrandom(){/**实现随机播放功能 */
    this.lastindex=this.index;
    if(this.SongArray.length>1){
      var i=Math.round(Math.random()*(this.SongArray.length-1));
      while(this.index==i)
      {
        i=Math.round(Math.random()*(this.SongArray.length-1));
      }
      this.index=i;
    }else{
     
    }
    this.listloop();
  }

  nextSong(){/**实现下一首歌曲功能 */

    if(this.SongArray.length>0){
      switch(this.sequenceflag){
        case 1:{
          this.lastindex=this.index;
          this.index++;     
          this.listloop();
        }break;
        case 2:{
          this.lastindex=this.index;
          this.index++;  
          this.listloop();/**切换下一曲，并设置为循环播放 */
          this.AudioPlay.loop=true;
        }break;
        case 3:{
          this.AudioPlay.loop=false;
          this.listrandom();
        }break;
      }
    }
  }
  backSong(){/**实现上一首功能 */
    if(this.SongArray.length>0){
      switch(this.sequenceflag){
        case 1:{
          this.lastindex=this.index;
          this.index--;  
          this.listloop();
        }break;
        case 2:{
          this.lastindex=this.index;
          this.index--;  
          this.listloop();
          this.AudioPlay.loop=true;
        }break;
        case 3:{
          this.AudioPlay.loop=false;
          this.listrandom();
        }break;
      }
    }
   
   }

  Addplay($event){/**实现列表播放按钮功能 */
        this.CurrentSongInfo=this.SongArray[$event.path[4].id];
        this.SongCurrentTime=this.updateCurrentTime(0);
        this.AudioPlay.currentTime=0;
        this.showLRC(this.SongArray[$event.path[4].id].lyricid);
        this.CurrentLrcLine=0;
        this.render.setAttribute(this.AudioPlay,"src",this.SongArray[$event.path[4].id].musicaddress); 
     
        this.AudioPlay.play();
        this.playflag=1;
        
        /**定时移动进度条 */
        clearInterval(this.Interval);
        this.setIntervalSongpro();
        this.lastindex=this.index;
        this.index=$event.path[4].id;
        this.setCurrentSongLine();  
  }

  collectSong(musicid){/**实现收藏当前列歌曲功能 */
    this.globalService.sendCollectMusic(musicid);
  }
  collectcurrentSong(){/**实现收藏当前正在播放的歌曲功能 */
    var sheetid="";
    this.Mservice.collectSong(this.CurrentSongInfo.musicid,"测试");
  }

  deleteSong($event){/**实现删除列表歌曲功能 */
    this.SongArray.splice($event.path[4].id,1);
    
  }

  lightLrcLine(lineNo){/**点亮当前行的歌词 */
    var fraction=0.5;  /**基准线百分比 */
   if(lineNo>0){
     this.render.removeClass(this.lrcline[this.lastLrcLine],"lrclight");
   }
   this.render.addClass(this.lrcline[lineNo],"lrclight");

   var _scrollTop;
    this.lrcView.nativeElement.scrollTop = 0;
    if (this.lrcView.nativeElement.clientHeight * fraction > this.lrcline[lineNo].offsetTop) {
        _scrollTop = 0;
    } else if (this.lrcline[lineNo].offsetTop > (this.lrcView.nativeElement.scrollHeight - this.lrcView.nativeElement.clientHeight * (1 - fraction))) {
        _scrollTop = this.lrcView.nativeElement.scrollHeight - this.lrcView.nativeElement.clientHeight;
    } else {
        _scrollTop = this.lrcline[lineNo].offsetTop - this.lrcView.nativeElement.clientHeight * fraction;
    }

    //以下声明歌词高亮行固定的基准线位置成为 “A”
    if ((this.lrcline[lineNo].offsetTop - this.lrcView.nativeElement.scrollTop) >= this.lrcView.nativeElement.clientHeight * fraction) {
      //如果高亮显示的歌词在A下面，那就将滚动条向下滚动，滚动距离为 当前高亮行距离顶部的距离-滚动条已经卷起的高度-A到可视窗口的距离
      this.lrcView.nativeElement.scrollTop += Math.ceil(this.lrcline[lineNo].offsetTop - this.lrcView.nativeElement.scrollTop - this.lrcView.nativeElement.clientHeight * fraction);

  } else if ((this.lrcline[lineNo].offsetTop - this.lrcView.nativeElement.scrollTop) < this.lrcView.nativeElement.clientHeight * fraction && _scrollTop != 0) {
      //如果高亮显示的歌词在A上面，那就将滚动条向上滚动，滚动距离为 A到可视窗口的距离-当前高亮行距离顶部的距离-滚动条已经卷起的高度
      this.lrcView.nativeElement.scrollTop -= Math.ceil(this.lrcView.nativeElement.clientHeight * fraction - (this.lrcline[lineNo].offsetTop - this.lrcView.nativeElement.scrollTop));

  } else if (_scrollTop == 0) {
    this.lrcView.nativeElement.scrollTop = 0;
  } else {
      this.lrcView.nativeElement.scrollTop += this.lrcline[0].height;
  }
  }

  synLrc(){/**同步歌词与歌曲 */
    if (this.CurrentLrcLine == this.Lrctime.length - 1 && +this.AudioPlay.currentTime.toFixed(3) >= parseFloat(this.Lrctime[this.CurrentLrcLine])) {
      this.lightLrcLine(this.CurrentLrcLine);
      //break;
  }
  if (parseFloat(this.Lrctime[this.CurrentLrcLine]) <= +this.AudioPlay.currentTime.toFixed(3) &&
       +this.AudioPlay.currentTime.toFixed(3) <= parseFloat(this.Lrctime[this.CurrentLrcLine+1])) {
      this.lightLrcLine(this.CurrentLrcLine);
      this.lastLrcLine=this.CurrentLrcLine;
      this.CurrentLrcLine++;
    }
  }

  parseLrctime(){/**将歌词的MM:SS:mm格式转为秒 */
    // var time=this.Lrctime;
    for(var i=0;i<this.Lrctime.length;i++){
      var t=this.Lrctime[i];
      this.Lrctime[i]=((+t.split(":")[0]*60)+parseFloat(t.split(":")[1])).toFixed(3);
    }
  }

  isCurrentLine(){/**音乐快进时调整歌词进度 */
    if(this.Lrctime!=null){
      for(var i=0;i<this.Lrctime.length;i++){
        if(this.AudioPlay.currentTime<this.Lrctime[i])break;
      }
      this.CurrentLrcLine=i-1;
    }

  }

  clearList(){/**清除整个歌单列表 */
    var len=this.SongArray.length;
    for(var j=0;j<len;j++){
      this.SongArray.pop();
    }
    
  }

  setCurrentSongLine(){/**改变当前播放的歌曲行样式 */
    // console.log(this.SongLine.toArray());
   if(this.SongLine[this.index])
   {
    //  this.render.removeClass(this.SongLine[this.lastindex].nativeElement,"currentSong");
    //  this.render.addClass(this.SongLine[this.index].nativeElement,"currentSong");
    // this.SongLine[this.lastindex].className="SonglistTr";
    // this.SongLine[this.index].className="SonglistTr currentSong";
   }
  }

  loadMusicFromExternal(){
    this.globalService.musicArray.subscribe((data:Array<music>)=>{
        var arr=this.SongArray;
        data.forEach((m)=>{
          var b=true;
          for(var t=0;t<arr.length;t++)
          {
            if(arr[t].musicid==m.musicid)b=false;
          }
          if(b){
            this.SongArray.push(m);
          }
        })
        this.msg.info("添加成功")
        if(this.globalService.NowPlay)
        {
          var i=arr.length-1;
          this.SongArray.forEach((e,index)=>{
              if(e.musicid==data[0].musicid)i=index;
          })
          this.playmusicByIndex(i);
        }
    })
  }

  playmusicByIndex(index){/**实现列表播放按钮功能 */
    this.CurrentSongInfo=this.SongArray[index];
    this.SongCurrentTime=this.updateCurrentTime(0);
    this.AudioPlay.currentTime=0;
    this.showLRC(this.SongArray[index].lyricid);
    this.CurrentLrcLine=0;
    this.render.setAttribute(this.AudioPlay,"src",this.SongArray[index].musicaddress); 
 
    this.AudioPlay.play();
    this.playflag=1;
    
    /**定时移动进度条 */
    clearInterval(this.Interval);
    this.setIntervalSongpro();
    this.lastindex=this.index;
    this.index=index;
    this.setCurrentSongLine();  
}

}
