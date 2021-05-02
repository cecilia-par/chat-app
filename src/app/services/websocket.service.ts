import { Injectable } from '@angular/core';
import { Observer, Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { TokenStorageService } from '.';
import { environment } from '../../environments/environment';
import { Message, User } from '../models';

@Injectable({ providedIn: 'root' })
export class WebsocketService {
  socket: any;
  observerMessage!: Observer<Message>;
  observerUser!: Observer<User>;

  constructor(private tokenStorageService: TokenStorageService) {}

  getMessage(): Observable<Message> {
    if (!this.socket) {
      let authorization = this.tokenStorageService.getToken();
      if (authorization) {
        this.socket = io(environment.apiUrl, {
          query: { authorization },
        }).connect();
      }
      this.socket.on('message', (res: any) => {
        this.observerMessage.next(res.message);
      });
    }

    return this.createObservableMessage();
  }

  getUser(): Observable<User> {
    if (!this.socket) {
      let authorization = this.tokenStorageService.getToken();
      if (authorization) {
        this.socket = io(environment.apiUrl, {
          query: { authorization },
        }).connect();
      }
      this.socket.on('user', (res: any) => {
        this.observerUser.next(res.user);
      });
    }

    return this.createObservableUser();
  }

  createObservableMessage(): Observable<Message> {
    return new Observable((observer) => {
      this.observerMessage = observer;
    });
  }

  createObservableUser(): Observable<User> {
    return new Observable((observer) => {
      this.observerUser = observer;
    });
  }
}
