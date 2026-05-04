import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = {
    email: 'nadia.rahman@tmrnd.example',
    password: 'password123'
  };

  errorMessage = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  signIn(): void {
    try {
      this.authService.login(this.credentials);
      void this.router.navigate(['/dashboard']);
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Unable to sign in';
    }
  }
}
