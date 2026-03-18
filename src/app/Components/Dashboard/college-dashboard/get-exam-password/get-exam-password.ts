import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-get-exam-password',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './get-exam-password.html',
  styleUrl: './get-exam-password.css',
})
export class GetExamPassword implements OnInit {
  examData: any[] = [];
  securityMessage: string = '';
  isLoading: boolean = false;
  currentTime: Date = new Date();
  private clockInterval: any; // Store reference to clear it later
  constructor(private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.fetchPasswords();
    // Update clock every second for the "Live" feel
    this.clockInterval = setInterval(() => {
      this.currentTime = new Date();
      // Manually trigger change detection to ensure the UI updates
      this.cdr.detectChanges(); 
    }, 1000);
  }

  fetchPasswords() {
  this.isLoading = true;
  this.http.get<any>('http://localhost:8081/api/exam/getExamPassword', {
    withCredentials: true,
  }).subscribe({
    next: (res) => {
      console.log("Raw Response:", res);
      
      // Handle the 'EMPTY' object response
      if (res && res.status === 'EMPTY') {
        this.examData = [];
        this.securityMessage = res.message;
      } 
      // Handle the Data Array response
      else if (Array.isArray(res)) {
        this.examData = res;
        this.securityMessage = '';
      } 
      else {
        this.examData = [];
        this.securityMessage = "Unexpected data format received.";
      }

      this.isLoading = false; // Set this BEFORE detecting changes
      this.cdr.detectChanges(); 
    },
    error: (err) => {
      console.error("API Error:", err);
      this.securityMessage = "Unable to connect to Security Server.";
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  });
}
}