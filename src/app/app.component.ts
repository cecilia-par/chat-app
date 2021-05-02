import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { TokenStorageService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'chat-app';
  isLoggedIn = false;

  constructor(
    private router: Router,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit(): void {
    var token = this.tokenStorageService.getToken();
    this.isLoggedIn = !!token;
    if (this.isLoggedIn) {
      const result = this.tokenStorageService.getUser();
      if (result) {
        this.router.navigate(['/chat']);
      }
    }
  }
}
