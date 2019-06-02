import { Resolve } from '@angular/router';
import { user } from '../class/user';
import { StorgeService } from '../services/storge.service'

export class MymusicResolve implements Resolve<user>{
 
    resolve():user{
        var storge=new StorgeService();
        var user=storge.getSessionStorage("user");
        return user;
    }
}