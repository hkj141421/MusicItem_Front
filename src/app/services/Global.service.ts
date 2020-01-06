import { Injectable, EventEmitter } from '@angular/core';
import { music } from '../class/music';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  musicArray:EventEmitter<Array<music>>=new EventEmitter<Array<music>>(); //发送给audio组件的音乐信息

  NowPlay:boolean=false;//发送给audio组件,是否立即播放

  collectmusicid:EventEmitter<number>=new EventEmitter<number>();//发送给收藏音乐组件,确定要收藏的音乐id

  searchkey:EventEmitter<string>=new EventEmitter<string>()//发送给搜索组件，搜索的关键字

  constructor() { }

  sendMusicToAudio(musicArray:Array<music>){
    this.NowPlay=true;
    this.musicArray.emit(musicArray);
  }

  sendMusicToAudioWait(musicArray:Array<music>){
    this.NowPlay=false;
    this.musicArray.emit(musicArray);
  }

  sendCollectMusic(musicid:number){
    console.log('发射事件musicid:'+musicid)
    this.collectmusicid.emit(musicid);
  }

  sendSearchKey(searchkey:string){
    this.searchkey.emit(searchkey);
  }

  trim(str:string):string
  {
    return str.replace(/(^\s*)|(\s*$)/g, "");
  }
  
}
