import { ChangeDetectorRef,Component } from '@angular/core';
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
export class LoginComponent {

  private url = environment.apiUrl;
  loginForm: FormGroup;
  submitted = false;
  successMessage = '';
  errorMessage = '';
ngOnInit() {
  console.log("LoginComponent INIT");
  
}

ngOnDestroy() {
  console.log("LoginComponent DESTROY");
}

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

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.loginForm.invalid) return;
    
    this.http.post<any>(
      `${ this.url }/auth/login`,
      this.loginForm.value,
      { withCredentials: true }
    ).subscribe({

      next: (res) => {
        this.errorMessage = '';
        this.successMessage = res.message;

        const role = res.data.role.toLowerCase();
        
        localStorage.setItem('userName', res.data.name);
        localStorage.setItem('userRole', role);

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
      },

      error: (err) => {
        //console.log("FULL ERROR OBJECT:", err);

        this.successMessage = '';

        // Safe extraction
        if (err?.error?.message) {
          this.errorMessage = err.error.message;
        } else if (typeof err?.error === 'string') {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = "Invalid credentials";
              }
             
      }
    });
  }

}

