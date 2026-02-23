import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth-service';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-college-layout',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl:'college-layout.html',
  styleUrl:'college-layout.css'
})
export class CollegeLayoutComponent implements OnInit {
  userName: string | null = '';
  role: string | null = '';
  isDarkMode: boolean = localStorage.getItem("smartseat-theme")==="dark"; //

  constructor(private router: Router,private authService: AuthService) {}

  ngOnInit(): void {

    this.userName = localStorage.getItem('userName');
    this.role = localStorage.getItem('userRole');

    // Safety check
    if (!this.role || this.role !== 'college') {
      this.router.navigate(['/login']);
    }
    const savedTheme = localStorage.getItem('smartseat-theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      document.body.classList.add('dark-mode');
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('smartseat-theme', this.isDarkMode ? 'dark' : 'light');
    
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
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
