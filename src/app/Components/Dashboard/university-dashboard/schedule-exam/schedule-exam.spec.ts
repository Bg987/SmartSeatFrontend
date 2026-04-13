import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { FormsModule } from '@angular/forms';

interface ScheduledSubject {
  subjectId: string;
  subjectName: string;
  branch: string;
  semester: number;
  examDate: string;
  startTime: string;
  duration: number;
}

@Component({
  selector: 'app-schedule-exam',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './schedule-exam.html',
  styleUrl: './schedule-exam.css',
})
export class ScheduleExam implements OnInit {
  url: string = environment.apiUrl2;
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  // State Management
  isConfiguring: boolean = false;
  isLoading: boolean = false;
  response: string = '';

  // AI Form Inputs
  aiSemester: number = 1;
  aiStartDate: string = '';
  aiStartTime: string = '09:00';

  // The resulting schedule
  selectedSubjects: ScheduledSubject[] = [];
  uniqueSems: number[] = [1, 2, 3, 4, 5, 6, 7, 8];

  ngOnInit(): void {}

  generateAiDraft() {
    if (!this.aiStartDate) {
      alert("Please select a starting date.");
      return;
    }

    this.isLoading = true;
    this.response = "AI is generating the synchronized semester timetable...";

    const params = {
      startDate: this.aiStartDate,
      startTime: this.aiStartTime
    };

    this.http.get<ScheduledSubject[]>(`${this.url}/exam/generate-ai-draft/${this.aiSemester}`, {
      params: params,
      withCredentials: true
    }).subscribe({
      next: (data) => {
        this.selectedSubjects = data;
        this.isConfiguring = true; // Switch to the table view
        this.isLoading = false;
        this.response = "";
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.response = "Error: " + (err.error?.error || "AI generation failed");
        this.cdr.detectChanges();
      }
    });
  }

  confirmAllSchedules() {
    this.isLoading = true;
    this.http.post(`${this.url}/university/confirm-ai-draft`, this.selectedSubjects, { withCredentials: true })
      .subscribe({
        next: (res: any) => {
          this.response = res.message;
          this.isConfiguring = false;
          this.selectedSubjects = [];
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.response = "Save Failed: " + (err.error?.error || "Check date constraints (min 25 days)");
          this.isLoading = false;
          this.cdr.detectChanges();
        }
    });
  }
}