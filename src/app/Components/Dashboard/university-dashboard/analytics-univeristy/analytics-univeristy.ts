import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
// Import your reusable component here
import { CollegeAnalyticsComponent } from '../../../college-analytics-component/college-analytics-component'; 


@Component({
  selector: 'app-analytics-univeristy',
  standalone: true,
  imports: [CommonModule, HttpClientModule, CollegeAnalyticsComponent], // Added component here
  templateUrl: './analytics-univeristy.html',
  styleUrl: './analytics-univeristy.css',
})
export class AnalyticsUniveristy implements OnInit {
  exams: any[] = [];
  colleges: any[] = [];
  selectedExamId: number | null = null;
  isLoading: boolean = false;
  url = environment.apiUrl;
  url2 = environment.apiUrl2;
  //examName:String;
  // Modal & Detail state
  selectedCollegeAnalytics: any = null;
  showModal: boolean = false;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchCompletedExams();
  }

  fetchCompletedExams() {
    this.isLoading = true;
    this.http.get<any[]>(`${this.url2}/exam/completed`, { withCredentials: true })
      .subscribe({
        next: (data) => {
          this.exams = data;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Failed to load exams', err);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  onExamSelected(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const examId = selectElement.value;

    if (!examId) {
      this.colleges = [];
      this.selectedExamId = null;
      return;
    }

    this.isLoading = true;
    this.selectedExamId = Number(examId);

    this.http.get<any[]>(`${this.url}/university/getCollegeDetailsForExam/${examId}`, { withCredentials: true })
      .subscribe({
        next: (data) => {
          this.colleges = data;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Failed to load college details', err);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  viewCollegeAnalytics(collegeId: number) {
  this.isLoading = true;
  this.http.post(`${this.url2}/exam/getAnalyticsUniversity/${this.selectedExamId}/${collegeId}`, {}, { withCredentials: true })
    .subscribe({
      next: (res) => {
        this.selectedCollegeAnalytics = res;
        this.showModal = true; // This triggers the popup
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
}

closeModal() {
  this.showModal = false;
  this.selectedCollegeAnalytics = null;
}
}