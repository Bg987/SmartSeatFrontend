import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { FormsModule } from '@angular/forms';

interface ScheduledSubject {
  subjectId: string;
  subjectName: string;
  examDate: string;
  startTime: string;
  duration: number;
  semester: number,
  branch: string,
}

@Component({
  selector: 'app-schedule-exam',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './schedule-exam.html',
  styleUrl: './schedule-exam.css',
})
export class ScheduleExam implements OnInit {

  alreadyScheduledMap: { [key: string]: boolean } = {};
  subjects: any[] = [];
  url: string = environment.apiUrl;
  private http = inject(HttpClient);
  // UI State
  response: any = '';
  isConfiguring: boolean = false;

  searchText: string = '';
  selectedDept: string = '';
  selectedBranch: string = '';
  selectedSem: string = '';

  // Separate configurations for selected subjects
  selectedSubjects: ScheduledSubject[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadSubjects();
  }

  loadSubjects() {
    this.http.get<any[]>(`${this.url}/university/getAllSubjects`, {
      withCredentials: true,
    }).subscribe({
      next: (data) => {
        this.subjects = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching subjects', err)
    });
  }

  // Toggle selection and initialize defaults for new subjects
  toggleSelection(s: any) {
    const index = this.selectedSubjects.findIndex(item => item.subjectId === s.subjectId);
    
    if (index > -1) {
      this.selectedSubjects.splice(index, 1);
    } else {
      this.selectedSubjects.push({
        subjectId: s.subjectId,
        subjectName: s.subjectName,
        semester : s.semester,
        examDate: '',
        branch : s.branch,
        startTime: '09:00', // Default
        duration: 180      // Default
      });
    }
  }

  isSubjectSelected(id: string): boolean {
    return this.selectedSubjects.some(s => s.subjectId === id);
  }

  proceedToConfigure() {
    this.response = '';
    if (this.selectedSubjects.length > 0) {
      this.isConfiguring = true;
      const ids = this.selectedSubjects.map(s => s.subjectId);
  
      this.http.post<any>(`${this.url}/university/check-scheduled`, ids, { withCredentials: true })
        .subscribe({
          next: (res) => {
            this.alreadyScheduledMap = res;
            this.isConfiguring = true;
            this.cdr.detectChanges();
          },
          error: (err) => console.error("Error checking subject status", err)
      });
    }
  }

  confirmAllSchedules() {
    // Check if all dates are filled
    const isInvalid = this.selectedSubjects.some(s => !s.examDate);
    if (isInvalid) {
      alert("Please select a date for all subjects.");
      return;
    } 
    this.response = "";
    this.http.post(`${this.url}/university/scheduleExam`, this.selectedSubjects, { withCredentials: true })
      .subscribe({
        next: (res: any) => {
          this.response = res.message;
          this.cdr.detectChanges();
          this.isConfiguring = false;
        },
        error: (err) => {
          this.response = err.error.error;
          this.cdr.detectChanges();
        } 
    });
    // Send this.selectedSubjects array to your backend
  }

  // Filters 
  get uniqueDepts() { return [...new Set(this.subjects.map(s => s.department))].filter(v => !!v); }
  get uniqueBranches() { return [...new Set(this.subjects.map(s => s.branch))].filter(v => !!v); }
  get uniqueSems() { return [...new Set(this.subjects.map(s => s.semester))].filter(v => !!v).sort(); }

  get filteredSubjects() {
    return this.subjects.filter(s => {
      const matchesSearch = !this.searchText || 
        s.subjectName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        s.subjectId.toLowerCase().includes(this.searchText.toLowerCase());
      return matchesSearch && 
             (!this.selectedDept || s.department === this.selectedDept) &&
             (!this.selectedBranch || s.branch === this.selectedBranch) &&
             (!this.selectedSem || s.semester?.toString() === this.selectedSem);
    });
  }
}