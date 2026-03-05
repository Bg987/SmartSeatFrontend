import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { AllocationService, ExamSubject } from '../../../../services/allocation';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-gen-seating-plan',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './gen-seating-plan.html',
  styleUrls: ['./gen-seating-plan.css']
})
export class GenSeatingPlan implements OnInit {
  allExams: ExamSubject[] = [];
  filteredExams: ExamSubject[] = [];
  
  // Dialog Control
  selectedExam: ExamSubject | null = null; // Holds the row data
  showConfirmDialog: boolean = false;      // Shows the data + "Allocate" button
  showResultDialog: boolean = false;       // Shows the API string result
  apiResponse: string = '';

  searchSubject: string = '';
  searchSemester: string = '';

  constructor(private allocationService: AllocationService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void { this.loadExams(); }

  loadExams() {
    this.allocationService.getIncompleteExams().subscribe({
      next: (data) => {
        
        this.allExams = data; this.filteredExams = data; 
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching exams', err)
    });
  }

  // Step 1: Open dialog with row data
  openConfirm(exam: ExamSubject) {
    this.selectedExam = exam;
    this.showConfirmDialog = true;
  }

  // Step 2: User clicks "Confirm" in the dialog
confirmAllocation() {
  if (!this.selectedExam) return;

  // Call the service instead of making the HTTP call directly
  this.allocationService.startAllocation(this.selectedExam.id).subscribe({
    next: (res: string) => {
      // 1. Update UI state with response
      this.apiResponse = res; 
      this.showConfirmDialog = false; 
      this.showResultDialog = true; 
      
      this.cdr.detectChanges();

      // 2. Handle the auto-close timer
      setTimeout(() => {
        this.showResultDialog = false;
        this.selectedExam = null;
        this.apiResponse = ""; 
        
        // 3. Refresh table data
        this.loadExams(); 

        this.cdr.detectChanges();
      }, 1000);
    },
    error: (err) => {
      console.error('Allocation Error:', err);
      alert("Allocation failed to trigger.");
      this.showConfirmDialog = false;
      this.cdr.detectChanges();
    }
  });
}

  closeDialog() {
    this.apiResponse = "";
    this.showConfirmDialog = false;
    this.selectedExam = null;
  }

  applyFilters() {
    this.filteredExams = this.allExams.filter(exam => {
      const matchSubject = exam.subjectName.toLowerCase().includes(this.searchSubject.toLowerCase()) ||
                           exam.subjectId.toLowerCase().includes(this.searchSubject.toLowerCase());
      return matchSubject && (this.searchSemester ? exam.semester?.toString() === this.searchSemester : true);
    });
  }
}