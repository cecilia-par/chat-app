import { TestBed, fakeAsync, inject, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { TokenStorageService } from './services';
import { AppComponent } from './app.component';
import { FAKE_USER } from './testing/fake-account';

describe('AppComponent', () => {
  let routerSpy: jasmine.SpyObj<Router>;
  const spyTokenStorageService = jasmine.createSpyObj('TokenStorageService', [
    'getToken',
    'getUser',
  ]);
  routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
      providers: [
        { provide: TokenStorageService, useValue: spyTokenStorageService },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'chat-app'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('chat-app');
  });

  it(`should have NgInit'`, fakeAsync(
    inject([Router, Location], (router: Router, location: Location) => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;
      spyTokenStorageService.getUser.and.returnValue(of(FAKE_USER));
      spyTokenStorageService.getToken.and.returnValue(
        of('7WK5T79u5mIzjIXXi2oI9Fglmgivv7RAJ7izyj9tUyQ')
      );
      app.ngOnInit();
      tick();
      fixture.detectChanges();
      expect(app.isLoggedIn).toBeTruthy();
    })
  ));
});
