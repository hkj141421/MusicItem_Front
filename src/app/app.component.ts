import { Component } from '@angular/core';
import { MusicService } from '../app/services/music.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TimeMusic';
  constructor(private Mservice:MusicService){}

  data:Array<any>;

  music:any

  ngOnInit() {
    this.Mservice.getSongList(84,1,1000).subscribe((data)=>{
      this.data=data.data;
      this.music=this.data[0];       
  },
  (err)=>{
     console.log(err);
  });
  }

  name:any='管理员';
  headimg:any='../assets/images/headimg.jpg';

}
