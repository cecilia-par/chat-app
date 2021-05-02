import { TestBed, fakeAsync } from '@angular/core/testing';
import { from, Observable, of } from 'rxjs';
import { WebsocketService } from './websocket.service';
import { TokenStorageService } from './tokenStorage.service';
// import { Server } from 'mock-socket';
// import { io } from 'socket.io-client';
// import { FAKE_MESSAGE, FAKE_MESSAGE1 } from '../testing/fake-chat';
// import { FAKE_USER } from '../testing/fake-account';
// import { Message } from '../models';

describe('WebsocketService', () => {
  let service: WebsocketService;
  //let originalTimeout: any;
  const spyTokenStorageService = jasmine.createSpyObj('tokenStorageService', [
    'getToken',
  ]);
  spyTokenStorageService.getToken.and.returnValue(
    of('7WK5T79u5mIzjIXXi2oI9Fglmgivv7RAJ7izyj9tUyQ')
  );
  //const fakeURL = 'http://localhost:3000';
  //const mockServer = new Server(fakeURL);
  //let authorization = spyTokenStorageService.getToken();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: TokenStorageService, useValue: spyTokenStorageService },
      ],
    });
    service = TestBed.inject(WebsocketService);
    //originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
    // mockServer.start();
  });

  afterEach(() => {
    //jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    //mockServer.stop();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /* it('should be getMessage should return value from observable', () => {
    spyOn(service, 'getMessage').and.returnValue(of(FAKE_MESSAGE));
    service.getMessage().subscribe((result: any) => {
      expect(result).toEqual(FAKE_MESSAGE);
      expect(result).toBeDefined();
    });
  });

  it('should be getUser hould return value from observable', () => {
    spyOn(service, 'getUser').and.returnValue(of(FAKE_USER));
    service.getUser().subscribe((result: any) => {
      expect(result).toEqual(FAKE_USER);
      expect(result).toBeDefined();
    });
  });

  it('should do createObservableUser async', (done: any) => {
    spyOn(service, 'createObservableUser').and.returnValue(of(FAKE_USER));
    spyOn(service, 'getUser').and.returnValue(of(FAKE_USER));
    const selected$ = service.createObservableUser();
    selected$.subscribe((selected) => {
      expect(selected).toBe(FAKE_USER);
      done();
    });
  });

  it('should do createObservableMessage async', (done: any) => {
    spyOn(service, 'createObservableMessage').and.returnValue(of(FAKE_MESSAGE));
    const selected$ = service.createObservableMessage();
    selected$.subscribe((selected) => {
      expect(selected).toBe(FAKE_MESSAGE);
      done();
    });
  }); */
});
