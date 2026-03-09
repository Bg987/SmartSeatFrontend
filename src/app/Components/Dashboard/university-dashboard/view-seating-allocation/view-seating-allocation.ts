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
  selectedRoomName: string = ''; 
  examName: string = '';         
  showGrid: boolean = false;
  isLoading: boolean = false;
  err: String = '';
  // Search/Filters
  searchSubject: string = '';
  searchSemester: string = '';

  // Grid Structure
  rows: number[] = [];
  columns: number[] = [];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadAllExams();
  }

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
  fetchCollegeDetails(exam: any): void {
    this.err = '';
    this.selectedColleges = [];
    this.selectedExamId = exam.id;
    this.examName = exam.subjectName+"-"+exam.semester+"-"+exam.subjectId+"-"+exam.examDate;
    this.showGrid = false; 
    this.isLoading = true;

    this.http.get<any[]>(`${this.apiUrl}/university/getCollegeDetailsForExam/${exam.id}`, { withCredentials: true })
      .subscribe({
        next: (data) => {
          console.log(data);
          this.selectedColleges = data;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isLoading = false;
          this.err = err.error;
          this.cdr.detectChanges();
        }
      });
  }

  onCollegeClick(collegeId: number): void {
    this.selectedCollegeId = collegeId;
    this.isLoading = true;

    this.http.get<any[]>(`${this.apiUrl}/university/getSeatBYCollege/${this.selectedExamId}/${this.selectedCollegeId}`, { withCredentials: true })
      .subscribe({
        next: (data) => {
          this.seats = data;
          this.showGrid = true;
          this.isLoading = false;
          this.err = '';
          if (this.seats && this.seats.length > 0) {
            // Use room_id for logic, display name for UI
            this.selectedRoomId = this.seats[0].room_id; 
            this.selectedRoomName = `${this.seats[0].block} - ${this.seats[0].roomNumber}`;
            this.generateGrid();
          }
          this.cdr.detectChanges();
        },
        error: (err) => { this.isLoading = false; console.error(err); }
      });
  }

  getRoomLabel(roomId: number): string {
    const seat = this.seats.find(s => s.room_id === roomId);
    return seat ? `Block ${seat.block} - ${seat.roomNumber}` : `Room ${roomId}`;
  }

  updateSelectedRoom(roomId: number): void {
    this.selectedRoomId = roomId;
    this.selectedRoomName = this.getRoomLabel(roomId);
    this.generateGrid();
  }

  generateGrid(): void {
    // Filter seats based on current room selection
    const roomSeats = this.seats.filter(s => s.room_id === this.selectedRoomId);
    
    if (roomSeats.length === 0) {
      this.rows = [];
      this.columns = [];
      return;
    }

    // Calculate dynamic boundaries
    const maxRow = Math.max(...roomSeats.map(s => s.row_no));
    const maxCol = Math.max(...roomSeats.map(s => s.col_no));

    this.rows = Array.from({ length: maxRow + 1 }, (_, i) => i);
    this.columns = Array.from({ length: maxCol + 1 }, (_, i) => i);
    this.cdr.detectChanges();
  }

  getStudentAt(r: number, c: number) {
    return this.seats.find(s => 
      s.room_id === this.selectedRoomId && 
      s.row_no === r && 
      s.col_no === c
    );
  }

  getUniqueRooms(): number[] {
    // Use a Set to get unique IDs from the seat data
    return [...new Set(this.seats.map(s => s.room_id))];
  }

  applyFilters(): void {
    this.selectedColleges = [];
    const searchLower = this.searchSubject.toLowerCase();
    this.filteredExams = this.exams.filter(exam => 
      (!this.searchSubject || exam.subjectName.toLowerCase().includes(searchLower) || exam.subjectId.toLowerCase().includes(searchLower)) &&
      (!this.searchSemester || exam.semester.toString() === this.searchSemester)
    );
  }
}