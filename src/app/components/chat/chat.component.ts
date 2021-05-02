import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { WebsocketService } from '../../services/websocket.service';
import { Message, User } from '../../models';
import { TokenStorageService } from '../../services';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  message: string = '';
  user!: User;
  subMessage!: Subscription;
  subUser!: Subscription;
  @ViewChild('containerChat') myScrollContainer!: ElementRef;

  constructor(
    private chatService: ChatService,
    private tokenStorageService: TokenStorageService,
    private webSocketService: WebsocketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subMessage = this.webSocketService
      .getMessage()
      .subscribe((message) => {
        if (message) this.messages.push(message);
      });

    this.subUser = this.chatService.getUser().subscribe((result: any) => {
      if (result.success) this.user = result.user;
    });

    this.chatService.getMessages().subscribe((result: any) => {
      if (result.messages) this.messages = result.messages;
    });

    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  sendMessage() {
    if (this.message && this.user)
      this.chatService.sendMessage(this.message, this.user).subscribe(() => {
        this.message = '';
      });
  }

  logout() {
    this.chatService.logout().subscribe(() => {
      this.tokenStorageService.signOut();
      this.router.navigate(['/login']);
    });
  }

  //Scroll auto vers le bas
  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  ngOnDestroy(): void {
    this.subMessage.unsubscribe();
    this.subUser.unsubscribe();
  }
}
