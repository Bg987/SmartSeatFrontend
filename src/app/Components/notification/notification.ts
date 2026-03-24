import { Component, OnInit, OnDestroy, ElementRef, HostListener,Renderer2, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, interval } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.html',
  styleUrls: ['./notification.css']
})
export class NotificationComponent implements OnInit, OnDestroy {
  unreadCount: number = 0;
  showNotifications: boolean = false;
  notifications: any[] = [];
  private pollingSub?: Subscription;
  private data: any;
  constructor(
    private notificationService: NotificationService,
    private eRef: ElementRef, // Used to detect clicks outside the component
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2 // Inject Renderer2
  ) {}

  ngOnInit(): void {
    // Polling every 30 seconds for new notifications
    this.getUnreadNotificationNumber();
  }
  getUnreadNotificationNumber(): void{
    this.pollingSub = interval(30000)
      .pipe(
        startWith(0),
        switchMap(() => this.notificationService.getUnreadCount())
      )
      .subscribe({
        next: (count) => {
          if (this.unreadCount !== count) {
            this.unreadCount = count;
            this.cdr.detectChanges(); // Force UI update for the badge
          }
        },
        error: (err) => console.error('Error fetching notification count', err)
      });
  }

  toggleNotifications(): void {
  this.showNotifications = !this.showNotifications;

  if (this.showNotifications) {
    // Standard logic to fetch and mark as read
    this.notificationService.getNotifications().subscribe({
      next: (data) => {
        this.notifications = data;
        if (this.unreadCount > 0) {
          this.notificationService.markAllAsRead().subscribe(() => {
            this.getUnreadNotificationNumber();
            this.cdr.detectChanges();
          });
        }
        this.cdr.detectChanges();
      }
    });
  } else {
    // Explicit close logic
    this.showNotifications = false;
    this.cdr.detectChanges();
  }
}

  ngOnDestroy(): void {
    // Clean up subscription to prevent memory leaks
    if (this.pollingSub) {
      this.pollingSub.unsubscribe();
    }
  }
}