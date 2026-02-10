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

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.loginForm.invalid) return;

    // 🔹 LOGIN
    this.http.post(
      'http://localhost:8080/api/auth/login',
      this.loginForm.value,
      { withCredentials: true, responseType: 'text' }
    ).subscribe({
      next: () => {

        // ROLE CHECK: STUDENT
        this.http.get(
          'http://localhost:8080/api/auth/student',
          { withCredentials: true, responseType: 'text' }
        ).subscribe({
          next: () => {
            this.router.navigate(['/student-dashboard']);
          },
          error: () => {

            // ROLE CHECK: COLLEGE
            this.http.get(
              'http://localhost:8080/api/auth/college',
              { withCredentials: true, responseType: 'text' }
            ).subscribe({
              next: () => {
                this.router.navigate(['/college-dashboard']);
              },
              error: () => {

                //  ROLE CHECK: UNIVERSITY
                this.http.get(
                  'http://localhost:8080/api/auth/university',
                  { withCredentials: true, responseType: 'text' }
                ).subscribe({
                  next: () => {
                    this.router.navigate(['/university-dashboard']);
                  },
                  error: () => {
                    this.errorMessage = 'Role not authorized';
                  }
                });

              }
            });

          }
        });

      },
      error: (err) => {
        this.errorMessage = err.error || 'Login failed!';
      }
    });
  }
}
