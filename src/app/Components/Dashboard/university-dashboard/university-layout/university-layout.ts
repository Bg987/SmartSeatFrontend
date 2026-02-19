import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../services/auth-service';
@Component({
  selector: 'app-university-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './university-layout.html',
  styleUrls: ['./university-layout.css'],
})
  
export class UniversityLayoutComponent {

  private url = environment.apiUrl;
  universityName: string | null = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {
    // role check
    if (localStorage.getItem('userRole') !== 'university') {
      this.router.navigate(['/']);
    }

    this.universityName = localStorage.getItem('userName');
  }

  onLogout() {
    this.authService.logout().subscribe({
      next: () => {
        this.authService.clearAndRedirect();
      },
      error: (err) => {
        console.error('Logout failed', err);
        this.authService.clearAndRedirect(); // Still redirect even if error
      }
    });
  }
}
