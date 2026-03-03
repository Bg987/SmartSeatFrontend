import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AllocationService } from '../../../../services/allocation';

@Component({
  selector: 'app-question-generation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './question-generation.html',
  styleUrl: './question-generation.css',
})
export class QuestionGeneration implements OnInit {
  // Data lists
  exams: any[] = [];
  filteredExams: any[] = [];
  
  // States
  loading: boolean = false;
  isGenerating: boolean = false;
  showUploadModal: boolean = false;

  // Filter Models
  searchSubject: string = '';
  searchSemester: string = '';

  // Modal Models
  selectedExam: any = null;
  selectedFile: File | null = null;
  questionCount: number = 10;
  resServer: String = "ffdkj";

  constructor(
    private allocationService: AllocationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadExams();
  }

  loadExams() {
    this.loading = true;
    this.allocationService.getExamsWithoutQuestions().subscribe({
      next: (data) => {
        this.exams = data;
        this.filteredExams = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load exams:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilters(): void {
    this.filteredExams = this.exams.filter(exam => {
      const searchLower = this.searchSubject.toLowerCase();
      const matchesSearch = !this.searchSubject || 
        exam.subjectName.toLowerCase().includes(searchLower) || 
        exam.subjectId.toLowerCase().includes(searchLower);
      
      const matchesSemester = !this.searchSemester || 
        (exam.semester && exam.semester.toString() === this.searchSemester);
      
      return matchesSearch && matchesSemester;
    });
  }

  // --- Modal Logic ---

  onGenerate(exam: any): void {
    this.selectedExam = exam;
    this.showUploadModal = true;
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.showUploadModal = false;
    this.selectedExam = null;
    this.selectedFile = null;
    this.isGenerating = false;
    this.questionCount = 10;
    this.cdr.detectChanges();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
    } else {
      alert('Please upload a valid PDF document.');
      event.target.value = '';
    }
  }

  confirmGeneration(): void {
  if (!this.selectedFile || !this.selectedExam) return;

  this.isGenerating = true;
  const examId = this.selectedExam.id; // Store ID locally

  this.allocationService.generateQuestionsFromPdf(this.selectedFile, this.questionCount, examId).subscribe({
    next: (response) => {

      // 1. Update the message to show in the modal before it closes
      this.resServer = response.message;
      this.isGenerating = false;
      this.cdr.detectChanges(); // Render the "Success" message in modal

      //  Wait for 1.2 second
      setTimeout(() => {
        //  Close the modal
        this.closeModal(); 

        //Update the actual data arrays
        this.exams = this.exams.filter(e => e.id !== examId);
        this.applyFilters(); // This updates filteredExams
        this.resServer = "";
        this.cdr.detectChanges(); 
      }, 1500);
    },
    error: (err) => {
      this.isGenerating = false;
      this.cdr.detectChanges();
      alert("Error: " + err.message);
    }
  });
  }
}