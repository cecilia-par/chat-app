import { TestBed } from '@angular/core/testing';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ApplicationHttpClient } from '../services';
import { ChatService } from '../services/chat.service';
import { AuthInterceptor } from '../helpers/auth.interceptor';
import { FAKE_MESSAGE, FAKE_MESSAGES } from '../testing/fake-chat';

describe('ChatService', () => {
  let service: ChatService;
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ChatService,
        { provide: ApplicationHttpClient },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        },
      ],
    });
    service = TestBed.inject(ChatService);
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be getMessage', () => {
    service.getMessages().subscribe((result: any) => {
      expect(result).not.toBeNull();
      expect(result).toEqual(FAKE_MESSAGES, 'expected Messages');
    });

    const req = httpMock.expectOne(service.http.ROOT_URL + '/message');
    expect(req.request.method).toEqual('GET');
    req.flush(FAKE_MESSAGES);
  });

  it('should be postMessage', () => {
    service
      .sendMessage(FAKE_MESSAGE.message, FAKE_MESSAGE.user)
      .subscribe((result: any) => {
        expect(result).not.toBeNull();
        expect(result).toEqual(FAKE_MESSAGE, 'expected Message');
      });

    const req = httpMock.expectOne(service.http.ROOT_URL + '/message');
    expect(req.request.method).toEqual('POST');
    req.flush(FAKE_MESSAGE);
  });
});
