import { TestBed } from '@angular/core/testing';
import { FAKE_USER } from '../testing/fake-account';
import { TokenStorageService } from './tokenStorage.service';

describe('TokenStorageService', () => {
  let service: TokenStorageService;
  let TOKEN_KEY: string = 'auth-token';
  const USER_KEY = 'auth-user';

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenStorageService);
    let store: any = {};
    const mockLocalStorage = {
      getItem: (key: string): string => {
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
    spyOn(sessionStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
    spyOn(sessionStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
    spyOn(sessionStorage, 'removeItem').and.callFake(
      mockLocalStorage.removeItem
    );
    spyOn(sessionStorage, 'clear').and.callFake(mockLocalStorage.clear);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be signOut', () => {
    sessionStorage.setItem('auth-token', 'sometoken');
    sessionStorage.setItem('auth-user', JSON.stringify(FAKE_USER));
    service.signOut();
    expect(localStorage.getItem('auth-token')).toBeNull(); // null
    expect(localStorage.getItem('auth-user')).toBeNull(); // null
  });

  it('should be saveToken', () => {
    service.saveToken('sometoken');
    expect(sessionStorage.getItem('auth-token')).toEqual('sometoken');
  });

  it('should be getToken', () => {
    sessionStorage.setItem('auth-token', 'sometoken');
    service.getToken();
    expect(sessionStorage.getItem('auth-token')).toEqual('sometoken');
  });

  it('should be saveUser', () => {
    service.saveUser(FAKE_USER);
    expect(sessionStorage.getItem('auth-user')).toEqual(
      JSON.stringify(FAKE_USER)
    );
  });

  it('should be getUser', () => {
    sessionStorage.setItem('auth-user', JSON.stringify(FAKE_USER));
    service.getUser();
    expect(sessionStorage.getItem('auth-user')).toEqual(
      JSON.stringify(FAKE_USER)
    );
  });

  it('should be getUser return {}', () => {
    sessionStorage.setItem('auth-user', '');
    service.getUser();
    expect(sessionStorage.getItem('auth-user')).toEqual('');
  });
});
