import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimetableService } from '../../../../services/timetable-service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GetTimetable } from '../get-timetable/get-timetable';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-add-time-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,GetTimetable],
  templateUrl: './add-time-table.html',
  styleUrl: './add-time-table.css',
})
export class AddTimeTable implements OnInit {

  // ================= STATE =================
  subjects: any[] = [];
  private url = environment.apiUrl;
  selectedSubjects: any[] = [];
  message: string = "";
  activeStep: number = 0;   // 0 = filter , 1 = select , 2 = schedule
  minExamDate!: string;
  loading: boolean = false;
  batchId!:string;

  constructor(
    private timetableService: TimetableService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.setMinExamDate();
  }

  // ================= STEP CONTROL =================
  setStep(step: number) {
    this.activeStep = step;
  }

  // ================= FILTER (Like getStudents) =================
  getSubjects(formValue: any): void {

    const payload = {
      department: formValue.department,
      branch: formValue.branch,
      semester: Number(formValue.semester)
    };

    this.loading = true;

    this.http.post<any[]>(
      `${this.url}/university/subjects/filter`,
      payload,
      { withCredentials: true }
    )
    .subscribe({
      next: (res) => {
        this.subjects = res ?? [];
        this.selectedSubjects = [];
        this.activeStep = 1;   //  go to selection step
        this.loading = false;
      
      localStorage.setItem('subjectsResponse', JSON.stringify(this.subjects));

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error fetching subjects:", err);
        this.subjects = [];
        this.loading = false;
      }
    });
  }

  // ================= SELECTION =================
  isSelected(subject: any): boolean {
    return this.selectedSubjects.some(
      s => s.subjectId === subject.subjectId
    );
  }

  toggleSubject(subject: any): void {

    const exists = this.selectedSubjects.find(
      s => s.subjectId === subject.subjectId
    );

    if (exists) {
      this.selectedSubjects = this.selectedSubjects.filter(
        s => s.subjectId !== subject.subjectId
      );
    } else {
      this.selectedSubjects.push({
        ...subject,
        examDate: null
      });
    }
  }

  // ================= DATE =================
  setMinExamDate(): void {
    const today = new Date();
    today.setMonth(today.getMonth() + 1);
    this.minExamDate = today.toISOString().split('T')[0];
  }

  // ================= GENERATE =================
  generateTimetable(): void {

    if (this.selectedSubjects.length === 0) {
      alert("Please select subjects first.");
      return;
    }

    const invalidDate = this.selectedSubjects.some(s => !s.examDate);

    if (invalidDate) {
      alert("Please select exam date for all subjects.");
      return;
    }

    this.timetableService
      .generateTimetable(this.selectedSubjects)
      .subscribe({
        next: (res: any) => {

          this.batchId=res.batchId;
          this.message =
            "Exam scheduled successfully. Batch ID = " +
            res.batchId;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.message = err?.error || "Something went wrong";
          this.cdr.detectChanges();
        }
      });
  }

  // ================= RESET =================
  resetAll(): void {
    this.subjects = [];
    this.selectedSubjects = [];
    this.activeStep = 0;
    this.message = "";
  }
}