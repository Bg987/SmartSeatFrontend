import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ResultService } from '../../../../services/result';
import { CommonModule } from '@angular/common'; // 1. Import this

@Component({
  selector: 'app-student-result',
  imports: [CommonModule],                    
  templateUrl: './student-result.html',
  styleUrls: ['./student-result.css']
})
export class StudentResult implements OnInit {
  completedExams: any[] = [];
  selectedResult: any = null;
  isLoading: boolean = true;


  constructor(private resultService: ResultService,
    private cdr : ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchCompletedExams();
  }

  fetchCompletedExams() {
    this.resultService.getCompletedExams().subscribe({
      next: (data) => {
        this.completedExams = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  viewResult(examId: string) {
    this.isLoading = true;
    this.resultService.getExamResult(examId).subscribe({
      next: (res) => {
        this.selectedResult = res;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        alert("Result not yet processed by University.");
        this.isLoading = false;
      }
    });
  }

  goBack() {
    this.selectedResult = null;
  }
}