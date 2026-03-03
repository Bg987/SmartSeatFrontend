import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExamService } from './exam.service';

@Component({
  selector: 'app-view-seating-allocation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-seating-allocation.html',
  styleUrl: './view-seating-allocation.css',
})
export class ViewSeatingAllocation implements OnInit {
  private examService = inject(ExamService);

  allExams: any[] = [];
  filteredExams: any[] = [];
  
  searchSubject: string = '';
  searchSemester: string = '';

  ngOnInit(): void {
    this.loadExams();
  }

  loadExams() {
    this.examService.getExams().subscribe({
      next: (data) => {
        this.allExams = data;
        this.filteredExams = data;
      },
      error: (err) => console.error('Failed to load exams', err)
    });
  }

  applyFilters() {
    this.filteredExams = this.allExams.filter(exam => {
      const matchesSearch = exam.subjectName.toLowerCase().includes(this.searchSubject.toLowerCase()) || 
                            exam.subjectId.toLowerCase().includes(this.searchSubject.toLowerCase());
      const matchesSem = this.searchSemester ? exam.semester == this.searchSemester : true;
      return matchesSearch && matchesSem;
    });
  }

  // Triggered directly on row click
  allocateSeats(exam: any) {
    if (exam.allocated) return; // Prevent double allocation

    console.log(`Allocating seats for: ${exam.subjectId}`);
    
    // Call your allocation API here
    // Example: this.examService.allocate(exam.id).subscribe(...)
    
    // Optimistic update for UI feedback
    exam.allocated = true;
  }
}