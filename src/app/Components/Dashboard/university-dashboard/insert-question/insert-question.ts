import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { AllocationService } from '../../../../services/allocation';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-insert-question',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './insert-question.html',
  styleUrl: './insert-question.css',
})
export class InsertQuestion implements OnInit {
  exams: any[] = [];
  filteredExams: any[] = [];
  loading = false;
  searchSubject = '';
  searchSemester = '';
  errorMessage: String ="";
  showInsertModal = false;
  selectedExam: any = null;
  manualQuestions: any[] = [];
  url2 = environment.apiUrl2;


  constructor(
    private allocationService: AllocationService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() { this.loadExams(); }

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
        console.error(err);
        this.loading = false; 
        if (err.status === 404) {
        this.errorMessage = "No exams awaiting question entry were found.";
      } else {
        this.errorMessage = "An unexpected error occurred while loading data.";
      }
      this.cdr.detectChanges();
        this.cdr.detectChanges();
      }
    });
  }

  applyFilters(): void {
    const searchLower = this.searchSubject.toLowerCase();
    this.filteredExams = this.exams.filter(exam => {
      const matchesSearch = !this.searchSubject || 
        exam.subjectName.toLowerCase().includes(searchLower) || 
        exam.subjectId.toLowerCase().includes(searchLower);
      
      const matchesSemester = !this.searchSemester || 
        (exam.semester && exam.semester.toString() === this.searchSemester);
      
      return matchesSearch && matchesSemester;
    });
  }

  openInsertModal(exam: any) {
    this.selectedExam = exam;
    this.showInsertModal = true;
    this.manualQuestions = [];
    this.addNewQuestion(); 
    this.cdr.detectChanges();
  }

  addNewQuestion() {
    this.manualQuestions.push({
      text: '',
      options: ['', '', '', ''],
      correctAnswerIndex: 0
    });
    this.cdr.detectChanges();
  }

  removeQuestion(index: number) {
    if (this.manualQuestions.length > 1) {
      this.manualQuestions.splice(index, 1);
    }
  }

  onCsvUpload(event: Event) {
    console.log("CSV Upload Triggered!"); 
    const element = event.target as HTMLInputElement;
    const file = element.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const text = e.target.result;
        this.parseCsv(text);
        element.value = ''; 
      };
      reader.readAsText(file);
    }
  }

  parseCsv(data: string) {
    const lines = data.split(/\r?\n/);
    const newQuestions: any[] = [];

    lines.forEach((line, index) => {
      if (!line.trim() || index === 0) return;

      const parts = line.split(','); 
      if (parts.length >= 3) {
        const questionText = parts[0].trim();
        const correctAnswerText = parts[1].trim();
        const optionsArray = parts[2].split(';').map(opt => opt.trim());

        const correctIdx = optionsArray.findIndex(opt => 
          opt.toLowerCase() === correctAnswerText.toLowerCase()
        );

        newQuestions.push({
          text: questionText,
          options: optionsArray,
          correctAnswerIndex: correctIdx !== -1 ? correctIdx : 0
        });
      }
    });

    if (newQuestions.length > 0) {
      // Check if first question is empty placeholder
      if (this.manualQuestions.length === 1 && !this.manualQuestions[0].text) {
        this.manualQuestions = [...newQuestions];
      } else {
        this.manualQuestions = [...this.manualQuestions, ...newQuestions];
      }
      alert(`Successfully imported ${newQuestions.length} questions.`);
      this.cdr.detectChanges();
    }
  }

  submitQuestions() {
  // 1. Filter out rows where the question text is empty
  const validQuestions = this.manualQuestions.filter(q => q.text && q.text.trim() !== '');
  
  if (validQuestions.length === 0) {
    alert("Please enter at least one question before saving.");
    return;
  }

  // 2. Final Confirmation
  const msg = `Ready to finalize the paper for ${this.selectedExam.subjectName}? \nTotal Questions: ${validQuestions.length}`;
  if (!confirm(msg)) return;

  this.loading = true;

  // 3. Clean Payload: Only what the backend expects
  const payload = {
    examId: this.selectedExam.id.toString(),
    questions: validQuestions,
    approved: true // Automatically approved as it's manual entry
    };
    

  //4. API Call
  this.http.post(`${this.url2}/exam/manual-insert`, payload, { 
    withCredentials: true,
    responseType: 'text' 
  }).subscribe({
    next: (res) => {
      alert("Exam paper successfully created and published.");
      this.showInsertModal = false;
      this.loadExams(); // Refresh list to remove the completed exam
    },
    error: (err) => {
      this.loading = false;
      console.error("API Error:", err);
      alert("Failed to save. Please ensure all options are filled.");
      this.cdr.detectChanges();
    }
  });
}

  trackByOption(index: number, item: any) { return index; }
  trackByFn(index: number, item: any) { return index; }

  addOption(questionIndex: number) {
    if (this.manualQuestions[questionIndex].options.length < 6) {
      this.manualQuestions[questionIndex].options.push('');
    }
  }

  removeOption(questionIndex: number, optionIndex: number) {
    const q = this.manualQuestions[questionIndex];
    if (q.options.length > 2) {
      q.options.splice(optionIndex, 1);
      if (q.correctAnswerIndex === optionIndex) {
        q.correctAnswerIndex = 0;
      } else if (q.correctAnswerIndex > optionIndex) {
        q.correctAnswerIndex--;
      }
    }
  }
}