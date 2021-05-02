import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { TokenStorageService } from '../../services';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: any = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';

  constructor(
    private chatService: ChatService,
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if (this.tokenStorageService.getToken()) {
      this.isLoggedIn = true;
    }
  }

  onSubmit() {
    this.chatService
      .login(this.form.username, this.form.password)
      .subscribe((data: any) => {
        if (data.success) {
          this.tokenStorageService.saveToken(data.authorization);
          this.tokenStorageService.saveUser(data);
          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.reloadPage();
        } else {
          this.errorMessage = data.message;
          this.isLoginFailed = true;
        }
      });
  }

  reloadPage(): void {
    this.router.navigateByUrl('/chat');
  }
}
