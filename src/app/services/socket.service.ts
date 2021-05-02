import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { User, Message } from '../models';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class SocketService {
  user!: User;
  // Initialise Socket.IO and wrap in observable
  socket: any;
  constructor(private router: Router) {
    this.socket = io(environment.SOCKET_ENDPOINT).connect();
    this.socket.on('success', (result: any) => {
      this.user = result.user;
      if (this.user)
        sessionStorage.setItem('token', this.user?.token.toString());
      this.router.navigateByUrl('/chat');
    });
    this.socket.on('disconnected', () => {
      sessionStorage.removeItem('token');
      window.location.reload();
    });
  }

  login(name: string, password: string) {
    let user = new User(name, password);
    this.socket.emit('login', user);
  }

  getUser() {
    if (this.socket) {
      this.socket.emit('getUser', sessionStorage.getItem('token'));
    }
    return new Observable((observer: any) => {
      this.socket.on('user', (result: any) => {
        this.user = result.user;
        observer.next(result.user);
      });
    });
  }

  logout() {
    this.socket.disconnect(this.user?.token);
    sessionStorage.removeItem('token');
    this.user;
    this.socket;
    window.location.reload();
  }

  sendMessage(msg: Message, token: string) {
    this.socket.emit('newMessage', msg, token);
  }

  getMessage() {
    return new Observable((observer: any) => {
      this.socket.on('getMessage', (result: any) => {
        observer.next(result.message);
      });
    });
  }

  getMessages() {
    return new Observable((observer: any) => {
      this.socket.on('getMessages', (messages: Message[]) => {
        observer.next(messages);
      });
    });
  }
}
