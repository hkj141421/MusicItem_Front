import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorgeService {

  constructor() { }

  setSessionStorage(key,value){
    sessionStorage.setItem(key,value);
  }

  removeSessionStorage(key){
    sessionStorage.removeItem(key);
  }

  getSessionStorage(key):any{
    return sessionStorage.getItem(key);
  }
  
}
