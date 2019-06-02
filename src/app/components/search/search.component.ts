import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/Global.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  public key:any;

  constructor(private global:GlobalService,private router:Router,private active:ActivatedRoute) { }

  ngOnInit(){
    // this.global.searchkey.subscribe((data)=>{
    //   console.log(data);
    //   this.key=data;
    // }
    // )
    this.active.params.subscribe((param:Params)=>{
      this.key=param["key"]
    })
  }
}
