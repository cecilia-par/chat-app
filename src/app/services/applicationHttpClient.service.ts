import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';

export interface IRequestOptions {
  headers?: HttpHeaders;
  observe?: 'body';
  params?: HttpParams;
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
  body?: any;
}

@Injectable()
export class ApplicationHttpClient {
  ROOT_URL = environment.apiUrl;

  // Extension de HttpClient
  public constructor(public http: HttpClient) {}

  /**
   * GET request
   * @param {string} endPoint (point final de l'API)
   * @param {IRequestOptions} options (headers, etc.)
   * @returns {Observable<T>}
   */
  public get<T>(endPoint: string, options?: IRequestOptions): Observable<T> {
    return this.http
      .get<T>(this.ROOT_URL + endPoint, options)
      .pipe(catchError(this.handleError<T>(endPoint)));
  }

  /**
   * POST request
   * @param {string} endPoint (point final de l'API)
   * @param {Object} params (corps de la demande)
   * @param {IRequestOptions} options (headers, etc.)
   * @returns {Observable<T>}
   */
  public post<T>(
    endPoint: string,
    params?: Object,
    options?: IRequestOptions
  ): Observable<T> {
    return this.http
      .post<T>(this.ROOT_URL + endPoint, params, options)
      .pipe(catchError(this.handleError<T>(endPoint)));
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  public handleError<T>(operation: string, result?: T) {
    return (error: any): Observable<T> => {
      console.error(error + ' ' + operation);
      return of(result as T);
    };
  }
}
