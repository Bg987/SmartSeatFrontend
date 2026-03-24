import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  url: String = environment.apiUrl;

  constructor(private zone: NgZone,
    private http: HttpClient
  ) { }


  getUnreadCount(): Observable<number> {
    return this.http.get<number>(`${this.url}/notifications/unread-count`, {
      withCredentials : true,
    });
  }

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.url}/notifications/latest`, {
      withCredentials: true
    });
  }

  markAllAsRead(): Observable<Notification[]> {
    return this.http.put<Notification[]>(`${this.url}/notifications/mark-as-read`,{}, {
      withCredentials: true
    });
  }
}