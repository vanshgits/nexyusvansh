import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  isRegistering = false;

  serverError: string | null = null;
  successMessage: string | null = null;

  private apiBase = 'http://localhost:3000/api';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get rf() {
    return this.registerForm.controls;
  }

  onRegisterSubmit() {
    this.serverError = null;
    this.successMessage = null;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isRegistering = true;

    this.http
      .post(`${this.apiBase}/users/register`, this.registerForm.value)
      .subscribe({
        next: () => {
          this.isRegistering = false;

          // ✅ show success
          this.successMessage = 'Account created successfully! Please log in.';

          // ✅ clear form
          this.registerForm.reset();

          // ✅ after 1.5 sec, go to login page
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },
        error: (err) => {
          this.isRegistering = false;
          console.error('Registration error', err);

          if (err.error?.message) {
            this.serverError = err.error.message;
          } else {
            this.serverError = 'Registration failed. Please try again.';
          }
        },
      });
  }
}
