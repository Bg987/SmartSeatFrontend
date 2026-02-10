import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent {

  loginForm: FormGroup;
  submitted = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      mail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['student', Validators.required]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.loginForm.invalid) return;

    this.http.post<any>(
      'http://localhost:8080/api/auth/login',
      this.loginForm.value,
      { withCredentials: true }   //  COOKIE
    ).subscribe({
      next: (res) => {

        // res = { message, name, role, email }

        this.successMessage = `Welcome ${res.name}`;

        //   store for dashboard
        localStorage.setItem('userName', res.name);
        localStorage.setItem('userRole', res.role);

        // ROLE BASED REDIRECT
        switch (res.role) {
          case 'student':
            this.router.navigate(['/student-dashboard']);
            break;

          case 'college':
            this.router.navigate(['/college-dashboard']);
            break;

          case 'university':
            this.router.navigate(['/university-dashboard']);
            break;

          default:
            this.errorMessage = 'Invalid role';
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Login failed!';
      }
    });
  }
}
