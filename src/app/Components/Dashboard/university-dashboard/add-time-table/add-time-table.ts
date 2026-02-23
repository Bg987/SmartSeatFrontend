import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AddSubjectService } from '../../../../services/add-subject-service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimetableService } from '../../../../services/timetable-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-time-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-time-table.html',
  styleUrl: './add-time-table.css',
})
export class AddTimeTable implements OnInit {

  subjects: any[] = [];
  selectedSubjects: any[] = [];
  message: string = "";
  countOfSubjects = 0;
  activeStep: number = 1;
  minExamDate!: string;

  constructor(
    private subjectService: AddSubjectService,
    private timetableService: TimetableService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadSubjects();
    this.setMinExamDate();
  }

  setStep(step: number) {
    this.activeStep = step;
  }

  loadSubjects(): void {
    this.subjectService.getAllSubjects().subscribe({
      next: (res: any) => {
        this.subjects = Array.isArray(res) ? res : (res ? [res] : []);
        this.countOfSubjects = this.subjects.length;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading subjects:', err);
        this.subjects = [];
      },
    });
  }

  isSelected(subject: any): boolean {
    return this.selectedSubjects.some(
      (s) => s.subjectId === subject.subjectId
    );
  }

  toggleSubject(subject: any) {

    const exists = this.selectedSubjects.find(
      (s) => s.subjectId === subject.subjectId
    );

    if (exists) {
      this.selectedSubjects = this.selectedSubjects.filter(
        (s) => s.subjectId !== subject.subjectId
      );
    } else {
      this.selectedSubjects.push({
        ...subject,
        examDate: null,
      });
    }
  }

  setMinExamDate() {
    const today = new Date();
    today.setMonth(today.getMonth() + 1);
    this.minExamDate = today.toISOString().split('T')[0];
  }

  generateTimetable() {

    if (this.selectedSubjects.length === 0) {
      alert("Please select subjects first.");
      return;
    }

    const invalidDate = this.selectedSubjects.some(
      (s) => !s.examDate
    );

    if (invalidDate) {
      alert("Please select exam date for all subjects.");
      return;
    }

    this.timetableService
      .generateTimetable(this.selectedSubjects)
      .subscribe({
        next: (res: any) => {
          this.message =
            "Exam scheduled successfully. Batch ID = " +
            res.batchId +
            ". Keep this safe for further use.";
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.message = err?.error || "Something went wrong";
          this.cdr.detectChanges();
        }
      });
  }

}