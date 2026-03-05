import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private zone: NgZone) { }

  /**
   * Establishes a Server-Sent Events connection.
   * @param url The full API endpoint for the SSE stream.
   */
  getServerSentEvent(url: string): Observable<any> {
    return new Observable(observer => {
      // Create the EventSource connection
      
        const eventSource = new EventSource(url, {
          withCredentials: true,
      });

      // Listen for the 'INIT' event (Optional connection start message)
      eventSource.addEventListener('INIT', (event: MessageEvent) => {
        console.log("SSE Connection Initialized");
      });

      // Listen for the specific 'event-complete' name used in Spring Boot
      eventSource.addEventListener('event-complete', (event: MessageEvent) => {
        this.zone.run(() => {
          try {
            // Attempt to parse if the data is a JSON string
            const parsedData = JSON.parse(event.data);
            observer.next(parsedData);
          } catch (e) {
            // Fallback for plain text messages
            observer.next(event.data);
          }
        });
      });

      // Handle connection errors
      eventSource.onerror = (error) => {
        this.zone.run(() => {
          // If the connection is closed by the server, error out.
          // Note: EventSource usually auto-reconnects on timeout.
          if (eventSource.readyState === EventSource.CLOSED) {
            observer.error('SSE connection was closed');
          }
        });
      };

      // Cleanup: Close the connection when the component unsubscribes
      return () => {
        eventSource.close();
      };
    });
  }
}