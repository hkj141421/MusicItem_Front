import { Component, OnInit } from '@angular/core';
import { FormGroupName, FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService,UploadFile } from 'ng-zorro-antd';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-personal-center',
  templateUrl: './personal-center.component.html',
  styleUrls: ['./personal-center.component.css']
})
export class PersonalCenterComponent implements OnInit {


  constructor(private builder:FormBuilder,private message:NzMessageService) { 
    
  }

  ngOnInit() {

  }
  
 
}
