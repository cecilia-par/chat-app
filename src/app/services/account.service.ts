import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { ApplicationHttpClient } from '../services';
import { User } from '../models';

let key = '6fa979f20126cb08aa645a8f495f6d85';
let iv = 'I8zyA4lVhMCaJ5Kg';

@Injectable({ providedIn: 'root' })
export class AccountService {
  constructor(public http: ApplicationHttpClient) {}

  login(username: string, password: string) {
    let passwordCrypt = CryptoJS.AES.encrypt(
      password,
      CryptoJS.enc.Utf8.parse(key),
      {
        iv: CryptoJS.enc.Utf8.parse(iv),
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC,
      }
    );

    let user = new User(username, passwordCrypt.toString());
    return this.http.post('/login', user);
  }

  logout() {
    return this.http.post('/logout');
  }

  getUser() {
    return this.http.get('/user');
  }
}
