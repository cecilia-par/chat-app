import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ChatComponent } from './chat.component';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../services';
import { WebsocketService } from '../../services/websocket.service';
import { ChatService } from '../../services/chat.service';
import { FAKE_MESSAGE, FAKE_MESSAGES } from 'src/app/testing/fake-chat';
import { FAKE_USER } from 'src/app/testing/fake-account';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from '../login/login.component';
import { FormsModule } from '@angular/forms';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let service: ChatService;
  let route: Router;

  const spyChatService = jasmine.createSpyObj('ChatService', [
    'logout',
    'getUser',
    'sendMessage',
    'getMessages',
  ]);
  spyChatService.getMessages.and.returnValue(of({ messages: FAKE_MESSAGES }));
  spyChatService.sendMessage.and.returnValue(of(FAKE_MESSAGE));
  spyChatService.getUser.and.returnValue(
    of({ success: true, user: FAKE_USER })
  );
  spyChatService.logout.and.returnValue(of({ success: true }));

  const spyTokenStorageService = jasmine.createSpyObj('TokenStorageService', [
    'signOut',
  ]);

  const spyWebsocketService = jasmine.createSpyObj('WebsocketService', [
    'getMessage',
  ]);
  spyWebsocketService.getMessage.and.returnValue(of(FAKE_MESSAGE));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatComponent],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'login', component: LoginComponent },
        ]),
        FormsModule,
      ],
      providers: [
        { provide: ChatService, useValue: spyChatService },
        { provide: WebsocketService, useValue: spyWebsocketService },
        { provide: TokenStorageService, useValue: spyTokenStorageService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatComponent);
    service = TestBed.inject(ChatService);
    route = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //Form Rendering
  it('should render input elements', () => {
    const compiled = fixture.debugElement.nativeElement;
    const logoutButton = compiled.querySelector('span[id="logout"]');
    const chatWrapperDiv = compiled.querySelector('div[id="chat-wrapper"]');
    const namemessage = compiled.querySelector('input[id="user-message-form"]');
    const sendMessageButton = compiled.querySelector('span[id="send-message"]');
    expect(logoutButton).toBeTruthy();
    expect(chatWrapperDiv).toBeTruthy();
    expect(namemessage).toBeTruthy();
    expect(namemessage).toBeTruthy();
    expect(sendMessageButton).toBeTruthy();
  });

  it('will have the both `ViewChild`s defined', () => {
    expect(fixture.componentInstance.myScrollContainer).toBeDefined();
  });

  it('should call getUser ngOnInit', () => {
    spyChatService.getUser().subscribe((arg: any) => {
      expect(arg.user).toEqual(FAKE_USER);
    });
  });

  it('should call SendMessage component', () => {
    component.user = FAKE_USER;
    component.sendMessage();
    fixture.detectChanges();
    expect(component.message).toEqual('');
  });

  it('should call SendMessage Service and return the message', () => {
    component.user = FAKE_USER;
    service
      .sendMessage(FAKE_MESSAGE.message, FAKE_USER)
      .subscribe((message: any) => {
        expect(message).toEqual(FAKE_MESSAGE);
      });
    expect(component.message).toEqual('');
  });

  it('should get user info', () => {
    component.user = FAKE_USER;
    fixture.detectChanges();
    expect(component.user).toEqual(FAKE_USER);
  });

  it('should call Logout component', () => {
    sessionStorage.setItem('auth-token', 'sometoken');
    sessionStorage.setItem('auth-user', JSON.stringify(FAKE_USER));
    component.logout();
    fixture.detectChanges();
    expect(localStorage.getItem('auth-token')).toBeNull(); // null
    expect(localStorage.getItem('auth-user')).toBeNull(); // null
  });

  it('should call Logout Service', () => {
    sessionStorage.setItem('auth-token', 'sometoken');
    sessionStorage.setItem('auth-user', JSON.stringify(FAKE_USER));
    service.logout().subscribe((result: any) => {
      expect(result.success).toEqual(true);
      expect(localStorage.getItem('auth-token')).toBeNull(); // null
      expect(localStorage.getItem('auth-user')).toBeNull(); // null
    });
  });
});
