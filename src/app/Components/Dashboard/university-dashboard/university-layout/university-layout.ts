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
  isDarkMode: boolean = localStorage.getItem("smartseat-theme")==="dark";
  private url = environment.apiUrl;
  universityName: string | null = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {
    // role check
    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
    }
    else {
      document.body.classList.remove('dark-theme');
    }
    if (localStorage.getItem('userRole') !== 'university') {
      this.router.navigate(['/']);
    }

    this.universityName = localStorage.getItem('userName');
  }
    toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    // Apply class to the root element for global styling
    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem("theme", "light");
    }
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
