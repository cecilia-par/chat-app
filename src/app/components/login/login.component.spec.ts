import {
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { TokenStorageService } from '../../services';
import { ChatService } from '../../services/chat.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { FAKE_USER } from 'src/app/testing/fake-account';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let location: Location;
  let routerSpy: jasmine.SpyObj<Router>;

  const spyTokenStorageService = jasmine.createSpyObj('TokenStorageService', [
    'getToken',
    'saveToken',
    'saveUser',
  ]);

  routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

  const spyChatService = jasmine.createSpyObj('ChatService', ['login']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        FormsModule,
      ],
      providers: [
        { provide: ChatService, useValue: spyChatService },
        { provide: TokenStorageService, useValue: spyTokenStorageService },
        { provide: Router, useValue: routerSpy },
      ],
      declarations: [LoginComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    location = TestBed.inject(Location);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //Form Rendering
  it('should render input elements', () => {
    const compiled = fixture.debugElement.nativeElement;
    const loginDiv = compiled.querySelector('div[id="login-screen"]');
    const nameInput = compiled.querySelector('input[name="username"]');
    const passwordInput = compiled.querySelector('input[name="password"]');
    const loginButton = compiled.querySelector('button[name="Login"]');
    expect(nameInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(loginButton).toBeTruthy();
    expect(loginDiv).toBeTruthy();
  });

  //Form Validity
  it('form invalid when empty', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('should test form validity', () => {
    expect(component.form.valid).toBeFalsy();
    const nameInput = component.form.controls.username;
    nameInput.setValue('Cécilia');
    const passwordInput = component.form.controls.password;
    passwordInput.setValue('gfdgfsdgfsdg');
    expect(component.form.valid).toBeTruthy();
  });

  //Input Validity and Input Errors
  it('username field validity and error', () => {
    let username = component.form.controls.username;
    expect(username.valid).toBeFalsy();

    username.setValue('');
    expect(username.hasError('required')).toBeTruthy();

    username.setValue('cecilia');
    expect(username.valid).toBeTruthy();
    expect(username.errors).toBeNull();
  });

  it('password field validity and error', () => {
    let password = component.form.controls.password;
    expect(password.valid).toBeFalsy();

    password.setValue('');
    expect(password.hasError('required')).toBeTruthy();

    password.setValue('motdepasse');
    expect(password.valid).toBeTruthy();
    expect(password.errors).toBeNull();
  });

  it('should set submitted to login => true', fakeAsync(() => {
    spyChatService.login.and.returnValue(
      of({
        success: true,
        authorization: spyTokenStorageService.getToken(),
        user: FAKE_USER,
      })
    );
    component.onSubmit();
    tick();
    fixture.detectChanges();
    spyChatService.login(FAKE_USER.username, FAKE_USER.password).subscribe({});
    expect(component.isLoggedIn).toBeTruthy();
    expect(component.isLoginFailed).toBeFalsy();
  }));

  it('should set submitted to login => false (fails)', fakeAsync(() => {
    spyChatService.login.and.returnValue(
      of({
        success: false,
        message: 'Wrong password or username',
      })
    );
    component.onSubmit();
    tick();
    fixture.detectChanges();
    expect(component.errorMessage).toBe('Wrong password or username');
    expect(component.isLoginFailed).toBeTruthy();
  }));

  it('should tell ROUTER to navigate when reloadPage called', fakeAsync(
    inject([Router, Location], (router: Router, location: Location) => {
      component.reloadPage();
      tick();
      fixture.detectChanges();
      const expectedPath = '/chat';
      const [actualPath] = routerSpy.navigateByUrl.calls.first().args;
      expect(actualPath).toBe(expectedPath, 'must navigate to the chat');
    })
  ));

  it('should tell GetToken to isLoggedIn => true', () => {
    spyTokenStorageService.getToken.and.returnValue(
      of('7WK5T79u5mIzjIXXi2oI9Fglmgivv7RAJ7izyj9tUyQ')
    );
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.isLoggedIn).toBeTruthy();
  });
});
