import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { CollegeAnalyticsComponent } from '../../../college-analytics-component/college-analytics-component';

@Component({
  selector: 'app-college-analytics',
  standalone: true,
  imports: [CommonModule, CollegeAnalyticsComponent],
  templateUrl: './college-analytics.html',
  styleUrls: ['./college-analytics.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollegeAnalytics implements OnInit {
  
  completedExams: any[] = [];
  selectedExamId: number | null = null;
  analyticsData: any = null; 
  loading = false;
  errorMessage = '';
  
  url: string = environment.apiUrl;
  url2: string = environment.apiUrl2;

  constructor(
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCompletedExams();
  }

  loadCompletedExams(): void {
    this.loading = true;
    this.errorMessage = '';

    this.http.get<any[]>(`${this.url}/colleges/getCompletedExamDetails`, {
      withCredentials: true,
    }).subscribe({
      next: (data) => {
        this.completedExams = data;
        this.loading = false;
        this.cd.markForCheck();
      },
      error: (err) => {
        console.error("Error fetching exams:", err);
        this.errorMessage = "Failed to load exam list.";
        this.loading = false;
        this.cd.markForCheck();
      }
    });
  }

  onExamSelect(examId: any): void {
    const id = Number(examId);
    if (!id) return;

    this.selectedExamId = id;
    this.loading = true;
    this.analyticsData = null; 
    this.errorMessage = '';

    this.http.post(`${this.url2}/exam/getAnalyticsCollege/${id}`, {}, {
      withCredentials: true
    }).subscribe({
      next: (data) => {
        this.analyticsData = data;
        this.loading = false;
        this.cd.markForCheck();
      },
      error: (err) => {
        this.errorMessage = "Analysis data not found for the selected exam.";
        this.loading = false;
        this.cd.markForCheck();
      }
    });
  }

  // Use 'any' if HTMLSelectElement causes strict typing issues in your IDE
  clearAnalysis(dropdown: any): void {
    this.analyticsData = null;
    this.selectedExamId = null;
    this.errorMessage = '';
    
    if (dropdown) {
      dropdown.value = ""; 
    }
    
    this.cd.markForCheck();
  }
}