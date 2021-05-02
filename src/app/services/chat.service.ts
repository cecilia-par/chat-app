import { Injectable } from '@angular/core';
import { Message, User } from '../models';
import { ApplicationHttpClient } from './';
import { AccountService } from 'src/app/services/account.service';

@Injectable({ providedIn: 'root' })
export class ChatService extends AccountService {
  constructor(http: ApplicationHttpClient) {
    super(http);
  }

  sendMessage(msg: string, user: User) {
    let message = new Message(msg, user);
    return this.http.post('/message', message);
  }

  getMessages() {
    return this.http.get('/message');
  }
}
