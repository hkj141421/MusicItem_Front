import { CanActivate } from '@angular/router';
import { StorgeService } from '../services/storge.service';
import {  Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class loginGuard implements CanActivate{

    constructor(private router:Router){}
    canActivate():boolean{
        var Storge=new StorgeService();
        var user=Storge.getSessionStorage("user");
        user=JSON.parse(user);
        if(user==null||user.userid==''||!user.userid||user.userid==null)
        {
            this.router.navigateByUrl("/nologin");
        }
        
        return (user!=""&&user!=null&&user)?true:false;
    }
    
}
