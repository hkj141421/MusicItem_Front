import { Injectable, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommonService } from './common.service';
import { user } from '../class/user';

@Injectable({
  providedIn: 'root'
})
export class VerificationService {

  constructor(private common:CommonService) { }

  verificationEmailCode(control:FormControl):any{
    this.common.checkEmailCode(control.value).subscribe((data:any)=>{
        if(data.status==="200")return null;
        else return {EmailCode:true};
    },(err)=>{
      console.log(err);
      return {EmailCode:true};
    })
    
  }
  
}
