import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // CRITICAL for editing
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-approve-question',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './approve-question.html',
  styleUrl: './approve-question.css',
})
export class ApproveQuestion implements OnInit {
  unapprovedExams: any[] = [];
  loading: boolean = true;
  selectedExamQuestions: any = null;
  showReviewModal: boolean = false;
  n: Number = 0;
  url2 = environment.apiUrl2;


  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchExams();
  }

  fetchExams() {
    this.loading = true;
    this.http.get<any[]>(`${this.url2}/exam/getExam`, { withCredentials: true }).subscribe({
      next: (data) => {
        this.unapprovedExams = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; }
    });
  }

  onReview(examId: number) {
    this.loading = true;
    this.http.get(`${this.url2}/exam/questions/${examId}`, { withCredentials: true }).subscribe({
      next: (res: any) => {
        this.selectedExamQuestions = res;
        this.n =this.selectedExamQuestions.questions.length;
        this.showReviewModal = true;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; alert("Error fetching questions"); }
    });
  }

  // --- EDITOR METHODS ---

  setCorrectAnswer(qIdx: number, optIdx: number) {
    this.selectedExamQuestions.questions[qIdx].correctAnswerIndex = optIdx;
  }

  addOption(qIdx: number) {
    if (this.selectedExamQuestions.questions[qIdx].options.length < 6) {
      this.selectedExamQuestions.questions[qIdx].options.push('New Option');
    }
  }

  deleteOption(qIdx: number, optIdx: number) {
    const q = this.selectedExamQuestions.questions[qIdx];
    if (q.options.length > 2) {
      q.options.splice(optIdx, 1);
      // Reset correct answer if the deleted one was selected
      if (q.correctAnswerIndex >= q.options.length) {
        q.correctAnswerIndex = 0;
      }
    }
  }

  deleteQuestion(index: number) {
    if (confirm('Are you sure you want to remove this question?')) {
      this.selectedExamQuestions.questions.splice(index, 1);
    }
  }

  addNewQuestion() {
    this.selectedExamQuestions.questions.push({
      text: 'New Question Text',
      options: ['Option 1', 'Option 2'],
      correctAnswerIndex: 0
    });
  }

  closeReview() {
    this.showReviewModal = false;
    this.selectedExamQuestions = null;
  }

  confirmApproval(examId: string) {
    if(this.n!=this.selectedExamQuestions.questions.length){
      alert(`Warning: Current questions (${this.selectedExamQuestions.questions.length}) does not match target (${this.n}).`)
      return;
    }
    if(!confirm("Are you sure you want to approve these questions? These changes are permanent and cannot be undone after submission.")){
      return;
    }
    this.loading = true;
    this.http.put(`${this.url2}/exam/approve/${examId}`, this.selectedExamQuestions, {
      withCredentials: true,
      responseType: 'text' 
    }).subscribe({
        next: (res) => {
            alert(res);
            this.showReviewModal = false;
            this.fetchExams(); // Refresh the grid to remove the approved item
            this.cdr.detectChanges();
        },
        error: (err) => {
            this.loading = false;
            console.error(err);
            alert("Failed to approve exam.");
        }
    });
  }

  trackByFn(index: number, item: any) {
  return index;
}
}