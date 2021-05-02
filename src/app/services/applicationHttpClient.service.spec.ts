import { TestBed } from '@angular/core/testing';
import { ApplicationHttpClient } from './applicationHttpClient.service';
import { AuthInterceptor } from '../helpers/auth.interceptor';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { FAKE_USER } from '../testing/fake-account';
import { User } from '../models';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

describe('ApplicationHttpClient', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let service: ApplicationHttpClient;
  const token = sessionStorage.getItem('auth_token');

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ApplicationHttpClient },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        },
      ],
    });
    service = TestBed.inject(ApplicationHttpClient);
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(httpClient).toBeTruthy();
  });

  it('can test HttpClient.get', () => {
    const res = {
      success: true,
      token: token,
      user: FAKE_USER,
    };
    httpClient
      .get<any>(service.ROOT_URL + '/user')
      .subscribe((data) => expect(data).toEqual(res));
    const req = httpMock.expectOne(service.ROOT_URL + '/user');
    expect(req.request.method).toEqual('GET');
    req.flush(res);
    httpMock.verify();
  });

  it('can test HttpClient.get with matching header', () => {
    const res = {
      success: true,
      token: token,
      user: FAKE_USER,
    };
    httpClient
      .get<any>(service.ROOT_URL + '/user', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .subscribe((data) => expect(data).toEqual(res));
    const req = httpMock.expectOne(service.ROOT_URL + '/user');
    expect(req.request.method).toEqual('GET');
    req.flush(res);
    httpMock.verify();
  });

  it('can test HttpClient.Post', () => {
    const res = {
      success: true,
      token: token,
      user: FAKE_USER,
    };
    httpClient
      .post<User>(service.ROOT_URL + '/login', FAKE_USER)
      .subscribe((response) => {
        expect(response).toBeTruthy();
      });
    const httpRequest = httpMock.expectOne({
      url: service.ROOT_URL + '/login',
    });
    expect(httpRequest.request.method).toEqual('POST');
    httpRequest.flush(res);
    httpMock.verify();
  });

  it('can test HttpClient.get Fail', () => {
    const errorResponse = new HttpErrorResponse({
      error: 'Wrong password or username',
      status: 404,
      statusText: 'Not Found',
    });
    const mockErrorResponse = { status: 404, statusText: 'Not Found' };
    httpClient.get<any>(service.ROOT_URL + '/user').subscribe(
      (user) => fail(errorResponse),
      (error) => {
        expect(error.error).toContain('Wrong password or username');
        catchError(service.handleError('/user'));
      }
    );
    const req = httpMock
      .expectOne(service.ROOT_URL + '/user')
      .flush('Wrong password or username', mockErrorResponse);
    //expect(service.handleError).toHaveBeenCalled();
    httpMock.verify();
  });
});
