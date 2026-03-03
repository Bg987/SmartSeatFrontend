import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AllocationService } from '../../../../services/allocation';

@Component({
  selector: 'app-view-seating-allocation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-seating-allocation.html',
  styleUrl: './view-seating-allocation.css',
})
export class ViewSeatingAllocation implements OnInit {
  // Main Exam Data
  exams: any[] = [];
  filteredExams: any[] = [];
  
  // Selected College Data
  selectedColleges: any[] = [];
  isLoadingDetails: boolean = false;
  selectedExamId: number | null = null;

  // Filter properties
  searchSubject: string = '';
  searchSemester: string = '';

  constructor(private allocationService: AllocationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAllExams();
  }

  loadAllExams(): void {

    this.allocationService.getCompleteExams().subscribe({
      next: (data) => {
        this.exams = data;
        this.filteredExams = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching exams:', err)
    });
  }

  applyFilters(): void {
    this.filteredExams = this.exams.filter(exam => {
      const searchLower = this.searchSubject.toLowerCase();
      const matchesSearch = !this.searchSubject || 
        exam.subjectName.toLowerCase().includes(searchLower) || 
        exam.subjectId.toLowerCase().includes(searchLower);
      const matchesSemester = !this.searchSemester || 
        exam.semester.toString() === this.searchSemester;
      return matchesSearch && matchesSemester;
    });
  }

  fetchCollegeDetails(exam: any): void {
    this.selectedExamId = exam.id;
    this.isLoadingDetails = true;
    this.selectedColleges = []; // Reset previous view

    // Calling your specific college details API
    this.allocationService.getCollegeDetailsForExam(exam.id).subscribe({
      next: (data) => {
        this.selectedColleges = data;
        this.isLoadingDetails = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching college details:', err);
        this.isLoadingDetails = false;
      }
    });
  }

  closeDetails(): void {
    this.selectedColleges = [];
    this.selectedExamId = null;
  }
}