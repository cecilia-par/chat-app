import { TestBed } from '@angular/core/testing';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FAKE_USER } from '../testing/fake-account';
import { ApplicationHttpClient } from '../services';
import { AccountService } from '../services/account.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthInterceptor } from '../helpers/auth.interceptor';

describe('AccountService', () => {
  let service: AccountService;
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AccountService,
        { provide: ApplicationHttpClient },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        },
      ],
    });
    service = TestBed.inject(AccountService);
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login return expected user', () => {
    service.login('Cécilia', 'motdepasse').subscribe((result: any) => {
      expect(result).not.toBeNull();
      expect(result).toEqual(FAKE_USER);
    });
    const req = httpMock.expectOne(service.http.ROOT_URL + '/login');
    expect(req.request.method).toEqual('POST');
    req.flush(FAKE_USER);
  });

  it('should be logout', () => {
    service.logout().subscribe((result: any) => {
      expect(result.success).toEqual(true);
    });
    const req = httpMock.expectOne(service.http.ROOT_URL + '/logout');
    expect(req.request.method).toEqual('POST');
  });

  it('should getUser return expected user', () => {
    service.getUser().subscribe((result: any) => {
      expect(result).not.toBeNull();
      expect(result).toEqual(FAKE_USER);
    });
    const req = httpMock.expectOne(service.http.ROOT_URL + '/user');
    expect(req.request.method).toEqual('GET');
    req.flush(FAKE_USER);
  });
});
