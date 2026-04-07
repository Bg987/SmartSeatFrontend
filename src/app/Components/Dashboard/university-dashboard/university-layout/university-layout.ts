import { Component, OnInit, OnDestroy, NgZone,ChangeDetectorRef,HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../services/auth-service';
import { NotificationService } from '../../../../services/notification'; 
import { NotificationComponent } from '../../../notification/notification';


@Component({
  selector: 'app-university-layout',
  standalone: true,
  imports: [CommonModule, RouterModule,NotificationComponent],
  templateUrl: './university-layout.html',
  styleUrls: ['./university-layout.css'],
})
// ... imports stay the same

export class UniversityLayoutComponent implements OnInit {
  isDarkMode: boolean = localStorage.getItem("smartseat-theme") === "dark";
  universityName: string | null = '';
  isQuestionMenuOpen: boolean = false;

  unreadCount: number = 0;
  showNotifications: boolean = false;
  notifications: any[] = [];

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.applyTheme();
    if (localStorage.getItem('userRole') !== 'university') {
      this.router.navigate(['/']);
    }
    this.universityName = localStorage.getItem('userName');
  }

  ngOnInit(): void {
    this.loadUnreadCount();
  }

  toggleNotifications(): void{
    alert("call");
  }
  
  loadUnreadCount() {
    this.notificationService.getUnreadCount().subscribe(count => {
      this.unreadCount = count;
      this.cdr.detectChanges();
    });
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem("smartseat-theme", this.isDarkMode ? "dark" : "light");
    this.applyTheme();
  }

  private applyTheme(): void {
    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
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

  toggleQuestionMenu() {
    this.isQuestionMenuOpen = !this.isQuestionMenuOpen;
  }
}