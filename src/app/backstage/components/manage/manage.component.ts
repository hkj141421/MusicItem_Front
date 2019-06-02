import { Component, OnInit } from '@angular/core';
import { StorgeService } from 'src/app/services/storge.service';
import { user } from 'src/app/class/user';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {

  isCollapsed:boolean=false;

  adminInfo:user;

  constructor(private storge:StorgeService) { }

  ngOnInit() {
    this.loadAdmin();
  }

  loadAdmin(){
    this.adminInfo=JSON.parse(this.storge.getSessionStorage("user"))
  }

}
