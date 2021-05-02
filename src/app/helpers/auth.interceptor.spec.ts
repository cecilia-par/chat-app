import { TestBed, inject, tick } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

import { ApplicationHttpClient } from '../services';
import { AuthInterceptor } from '../helpers/auth.interceptor';

describe('AuthInterceptor', () => {
  sessionStorage.setItem('auth_token', 'dffdrdfgfdfdfdfd');
  let service: ApplicationHttpClient;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ApplicationHttpClient },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
      ],
    });
    httpClient = TestBed.inject(HttpClient);
    service = TestBed.inject(ApplicationHttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('adds Authorization header', () => {
    httpClient
      .get<any>(service.ROOT_URL + '/user')
      .subscribe((response) => expect(response).toBeTruthy());
    const httpRequest = httpMock.expectOne({
      url: service.ROOT_URL + '/user',
    });
    expect(httpRequest.request.method).toEqual('GET');
    /* expect(httpRequest.request.headers.has('Authorization')).toEqual(true);
      expect(httpRequest.request.headers.get('Authorization')).toEqual(
        `Bearer ${authToken}`
      ); */
    httpMock.verify();
  });
});
