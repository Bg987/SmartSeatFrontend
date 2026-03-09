import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../services/auth-service';

@Component({
  selector: 'app-student-layout',
   imports: [CommonModule, RouterModule],
  templateUrl: './student-layout.html',
  styleUrl: './student-layout.css',
})
export class StudentLayout {

  isDarkMode: boolean = false;
  notifications: string[] = [];


  constructor(
    private authService: AuthService
  ){}


  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    // Example notification for first-time students
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  removeNotification(note: string): void {
    this.notifications = this.notifications.filter(n => n !== note);
  }

    onLogout(): void {
    this.authService.logout().subscribe({
      next: () => this.authService.clearAndRedirect(),
      error: (err) => {
        console.error('Logout failed', err);
        this.authService.clearAndRedirect();
      }
    });
  }

  trackByFn(index: number, item: any): any {
    return index;
  }
}
