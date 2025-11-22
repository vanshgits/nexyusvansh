import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoggingIn = false;
  loginServerError: string | null = null;

  private apiBase = 'http://localhost:3000/api';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  get lf() {
    return this.loginForm.controls;
  }

  onLoginSubmit() {
    this.loginServerError = null;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoggingIn = true;

    this.http
      .post(`${this.apiBase}/users/login`, this.loginForm.value)
      .subscribe({
        next: (res: any) => {
          this.isLoggingIn = false;
          console.log('Login success', res);

          // TODO later: save token in localStorage
          // localStorage.setItem('token', res.token);

          // ✅ Go to home page
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.isLoggingIn = false;
          console.error('Login error', err);

          if (err.error?.message) {
            this.loginServerError = err.error.message;
          } else {
            this.loginServerError = 'Invalid email or password.';
          }
        },
      });
  }
}
