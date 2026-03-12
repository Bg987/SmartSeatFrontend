import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent implements OnInit, OnDestroy {
  private url = environment.apiUrl;

  
  // UI State variables
  showConfirm: boolean = false;
  isLoading: boolean = false; // Added for the loader
  submitted = false;
  
  loginForm: FormGroup;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
    this.loginForm = this.fb.group({
      mail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['student', Validators.required]
    });
  }

  ngOnInit() {
    console.log("SmartSeat Login Initialized");
  }

  ngOnDestroy() {
    console.log("Login Component Destroyed");
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';
    
    if (this.loginForm.invalid) return;

    // Start Loader
    this.isLoading = true;

    this.http.post<any>(
      `${this.url}/auth/login`,
      this.loginForm.value,
      { withCredentials: true }
    ).subscribe({
      next: (res) => {
        this.isLoading = false; // Stop Loader
        this.successMessage = res.message;

        const role = res.data.role.toLowerCase();
        localStorage.setItem('userName', res.data.name);
        localStorage.setItem('userRole', role);

        // Professional navigation delay (optional: gives user time to see success)
        setTimeout(() => {
          switch (role) {
            case 'student':
              this.router.navigate(['/student-dashboard']);
              break;
            case 'college':
              this.router.navigate(['/college-dashboard']);
              break;
            case 'university':
              this.router.navigate(['/university-dashboard']);
              break;
          }
        }, 500);
        
        this.cd.detectChanges();
      },
      error: (err) => {
        
        this.isLoading = false; // Stop Loader on error
        this.successMessage = '';
        if (err?.error?.message) {
          this.errorMessage = err.error.message;
        } else if (typeof err?.error === 'string') {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = "Authentication failed. Please check your credentials.";
        }
        
        this.cd.detectChanges();
      }
    });
  }
}