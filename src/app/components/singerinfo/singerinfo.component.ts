import { Component, OnInit } from '@angular/core';
import { singer } from 'src/app/class/singer';
import { GlobalService } from 'src/app/services/Global.service';
import { SingerService } from 'src/app/services/singer.service';
import { ActivatedRoute, Params } from '@angular/router';
import { MusicService } from 'src/app/services/music.service';

@Component({
  selector: 'app-singerinfo',
  templateUrl: './singerinfo.component.html',
  styleUrls: ['./singerinfo.component.css']
})
export class SingerinfoComponent implements OnInit {

  AlbumArray:Array<any>;

  singer:singer=new singer();

  pagesize:number=30;

  pagenumber:number=1;

  total:number;

  singerimg:any;

  constructor(private globalService:GlobalService,private singerService:SingerService,private Active:ActivatedRoute,private musicService:MusicService) { }

  ngOnInit() {
    this.Active.params.subscribe((params:Params)=>{
        this.loadSingerInfo(params["singerid"]);
    })
  }

  loadSingerInfo(id)
  {
    this.singerService.getSingerByid(id).subscribe((data)=>{
        if(data.status=='200')
        {
          this.singer=data.data;
          this.singerimg='url('+this.singer.singerimg+')';
          this.loadAlbum(this.singer.singername);
        }else console.log(data);
    },(err)=>{
      console.log(err);
    })
  }

  loadAlbum(name){
    this.singerService.getSingerOfAlbum(name).subscribe((data)=>{
          if(data.status=='200')
          {
            this.AlbumArray=data.data;
          }else console.log(data);
    },(err)=>{
           console.log(err);
    })
  }
}
