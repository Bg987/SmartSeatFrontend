import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-view-seating-allocation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-seating-allocation.html',
  styleUrl: './view-seating-allocation.css',
})
export class ViewSeatingAllocation implements OnInit {
  // Config
  apiUrl: string = environment.apiUrl;

  // Data State
  exams: any[] = [];
  filteredExams: any[] = [];
  selectedColleges: any[] = [];
  seats: any[] = [];
  
  // UI State
  selectedExamId: number | null = null;
  selectedCollegeId: number | null = null;
  selectedRoomId: number | null = null;
  selectedRoomBlock: number | null = null;
  selectedRoomName: string = ''; // Added for HTML
  examName: string = '';         // Added for HTML
  showGrid: boolean = false;
  isLoading: boolean = false;
  isDarkMode: boolean = false;   // Added for Theme Toggle

  // Search/Filters
  searchSubject: string = '';
  searchSemester: string = '';

  // Grid Structure
  rows: number[] = [];
  columns: number[] = [];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    this.loadAllExams();
  }


  // API 1: Fetch Exams
  loadAllExams(): void {
    this.http.get<any[]>(`${this.apiUrl}/university/getCompleteExam`, { withCredentials: true })
      .subscribe({
        next: (data) => {
          this.exams = data;
          this.filteredExams = data;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Exam Fetch Error:', err)
      });
  }

  // API 2: Fetch Colleges for selected Exam
  fetchCollegeDetails(exam: any): void {
    this.selectedExamId = exam.id;
    this.examName = exam.subjectName; // Set exam name for display
    this.showGrid = false; 
    this.isLoading = true;

    this.http.get<any[]>(`${this.apiUrl}/university/getCollegeDetailsForExam/${exam.id}`, { withCredentials: true })
      .subscribe({
        next: (data) => {
          this.selectedColleges = data;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => { this.isLoading = false; console.error(err); }
      });
  }

  // API 3: Fetch Actual Seats
  onCollegeClick(collegeId: number): void {
    this.selectedCollegeId = collegeId;
    this.isLoading = true;

    this.http.get<any[]>(`${this.apiUrl}/university/getSeatBYCollege/${this.selectedExamId}/${this.selectedCollegeId}`, { withCredentials: true })
      .subscribe({
        next: (data) => {
          this.seats = data;
          this.showGrid = true;
          this.isLoading = false;
          
          if (this.seats.length > 0) {
            this.selectedRoomBlock = this.seats[0].roomNumber;
            this.selectedRoomId = this.seats[0].block;
            this.selectedRoomName = this.seats[0].block+" "+this.seats[0].roomNumber;
            this.generateGrid();
          }
          this.cdr.detectChanges();
        },
        error: (err) => { this.isLoading = false; console.error(err); }
      });
  }

  generateGrid(): void {
    const roomSeats = this.seats.filter(s => s.room_id === this.selectedRoomId);
    if (roomSeats.length === 0) return;

    const maxRow = Math.max(...roomSeats.map(s => s.row_no));
    const maxCol = Math.max(...roomSeats.map(s => s.col_no));

    this.rows = Array.from({ length: maxRow + 1 }, (_, i) => i);
    this.columns = Array.from({ length: maxCol + 1 }, (_, i) => i);
  }

  getStudentAt(r: number, c: number) {
    return this.seats.find(s => s.room_id === this.selectedRoomId && s.row_no === r && s.col_no === c);
  }

  getUniqueRooms() {
    return [...new Set(this.seats.map(s => s.room_id))];
  }

  applyFilters(): void {
    const searchLower = this.searchSubject.toLowerCase();
    this.filteredExams = this.exams.filter(exam => 
      (!this.searchSubject || exam.subjectName.toLowerCase().includes(searchLower) || exam.subjectId.toLowerCase().includes(searchLower)) &&
      (!this.searchSemester || exam.semester.toString() === this.searchSemester)
    );
  }
}