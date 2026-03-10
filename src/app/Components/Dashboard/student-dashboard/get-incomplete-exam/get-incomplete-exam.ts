import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-get-incomplete-exam',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './get-incomplete-exam.html',
  styleUrl: './get-incomplete-exam.css',
})
export class GetIncompleteExam implements OnInit {
  url: string = environment.apiUrl;
  
  // Data States
  exams: any[] = [];
  selectedAllocation: any = null;
  seatGrid: any[][] = [];
  
  // UI States
  isLoading: boolean = true;
  isViewingTicket: boolean = false;
  errorMessage: string | null = null;
  
  // Helpers
  today = new Date();
  maxRows: number = 0;
  maxCols: number = 0;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchUpcomingExams();
  }

  fetchUpcomingExams() {
    this.isLoading = true;
    this.http.get<any[]>(`${this.url}/student/getStudentIncomplteExam`, { withCredentials: true })
      .subscribe({
        next: (data) => {
          this.exams = data;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          this.errorMessage = err.status === 404 ? err.error : "Unable to load exams.";
          this.cdr.detectChanges();
        }
      });
  }

  viewSeat(examId: number) {
  this.isLoading = true;
  this.http.get<any>(`${this.url}/student/getStudentExamDetails/${examId}`, { withCredentials: true })
    .subscribe({
      next: (data) => {
        // 1. Identify the logged-in student's seat first
        const mySeatInfo = data.seatDetails.find(
          (s: any) => s.enrollmentNo === data.enrollmentNo
        );

        if (mySeatInfo) {
          // 2. FILTER: Only keep seats that belong to the SAME room
          const filteredSeats = data.seatDetails.filter(
            (s: any) => s.room_id === mySeatInfo.room_id
          );

          // 3. Update the object with ONLY the relevant room data
          this.selectedAllocation = {
            ...data,
            seatDetails: filteredSeats
          };

          this.generateGrid();
          this.isViewingTicket = true;
        } else {
          alert("You are not allocated a seat for this exam.");
        }
        
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        alert(err.error?.message || "Allocation details not found.");
        this.cdr.detectChanges();
      }
    });
}

  generateGrid() {
    if (!this.selectedAllocation || !this.selectedAllocation.seatDetails) return;
    const details = this.selectedAllocation.seatDetails;
    this.maxRows = Math.max(...details.map((s: any) => s.row_no)) + 1;
    this.maxCols = Math.max(...details.map((s: any) => s.col_no)) + 1;

    this.seatGrid = Array.from({ length: this.maxRows }, () => 
      Array.from({ length: this.maxCols }, () => null)
    );

    details.forEach((seat: any) => {
      this.seatGrid[seat.row_no][seat.col_no] = seat;
    });
    this.cdr.detectChanges();
  }

  getDaysRemaining(examDate: string): number {
    const exam = new Date(examDate);
    const t1 = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());
    const t2 = new Date(exam.getFullYear(), exam.getMonth(), exam.getDate());
    return Math.floor((t2.getTime() - t1.getTime()) / (1000 * 60 * 60 * 24));
  }

  goBack() {
    this.isViewingTicket = false;
    this.selectedAllocation = null;
  }
}