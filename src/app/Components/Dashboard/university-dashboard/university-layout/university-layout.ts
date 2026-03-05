import { Component, OnInit, OnDestroy, NgZone,ChangeDetectorRef,HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../services/auth-service';
import { NotificationService } from '../../../../services/notification'; 
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-university-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './university-layout.html',
  styleUrls: ['./university-layout.css'],
})
export class UniversityLayoutComponent implements OnInit, OnDestroy {
  isDarkMode: boolean = localStorage.getItem("smartseat-theme") === "dark";
  private apiUrl = environment.apiUrl;
  universityName: string | null = '';
  
  // Notification Management
  notifications: string[] = []; 
  private sseSub?: Subscription;

  constructor(
    private router: Router,
    private cdr : ChangeDetectorRef,
    private http: HttpClient,
    private authService: AuthService,
    private notificationService: NotificationService,
    private zone: NgZone // Added to ensure UI updates across threads
  ) {
    // Initial Theme Setup
    this.applyTheme();

    // Role Guard
    if (localStorage.getItem('userRole') !== 'university') {
      this.router.navigate(['/']);
    }

    this.universityName = localStorage.getItem('userName');
  }

  @HostListener('document:visibilitychange', [])
  onVisibilityChange() {
    if (document.hidden) {
      // Optional: Clear notifications when user leaves tab to prevent "stacking"
      // this.notifications = [];
    } else {
      // When user returns, force a clean render
      this.cdr.detectChanges();
    }
  }

  ngOnInit(): void {
  const sseUrl = `${this.apiUrl}/notifications/subscribe/university`;
  
  this.sseSub = this.notificationService.getServerSentEvent(sseUrl).subscribe({
    next: (res) => {
      this.zone.run(() => {
        // If we have more than 5, remove the oldest (last) one immediately
        // This stops the "infinite growth" problem
        if (this.notifications.length >= 5) {
          this.notifications.pop(); 
        }

        // 2. Add the new one to the top
        this.notifications.unshift(res);
        this.cdr.detectChanges();

        // 3. The cleanup timer still works for individual items,
        // but the 'pop()' above handles the 1-second spam.
        setTimeout(() => {
          this.zone.run(() => {
            this.removeNotification(res);
          });
        }, 10000);
      });
    }
  });
}

removeNotification(message: string): void {
  this.notifications = this.notifications.filter(n => n !== message);
  this.cdr.detectChanges(); // Refresh UI after removal
}

// Add this helper function for the HTML
trackByFn(index: number, item: string) {
  return index; // Or return item if the messages are always unique
}

  /**
   * Toggles between light and dark themes
   */
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

  /**
   * Handles user logout
   */
  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => this.authService.clearAndRedirect(),
      error: (err) => {
        console.error('Logout failed', err);
        this.authService.clearAndRedirect();
      }
    });
  }

  /**
   * Cleanup SSE connection to prevent memory leaks and ghost connections
   */
  ngOnDestroy(): void {
    if (this.sseSub) {
      this.sseSub.unsubscribe();
    }
  }
}