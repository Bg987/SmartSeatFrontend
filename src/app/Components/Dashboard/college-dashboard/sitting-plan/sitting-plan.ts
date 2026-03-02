import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-sitting-plan',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './sitting-plan.html',
  styleUrl: './sitting-plan.css',
})
export class SittingPlan implements OnInit {

  students: any[] = [];
  filteredStudents: any[] = [];

  rows: number[] = [];
  columns: number[] = [];

  searchText: string = '';
  loading = false;

  collegeId = Number(localStorage.getItem('collegeId'));
  examId = 69;

  // 🔹 Exam
  examName: string = '';
  showSittingPlan = false;

  // 🔹 Room Handling
  uniqueRooms: any[] = [];
  selectedRoom!: any;
  roomid!: number;

  // 🔹 Room Info
  roomNumber!: number;
  capacity!: number;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.getExamName();
  }

  //  Fetch Exam Name First
  getExamName() {
    this.http
      .get(
        `http://localhost:8080/api/colleges/getExamName/${this.examId}`,
        { responseType: 'text', withCredentials: true }
      )
      .subscribe({
        next: (response) => {
          this.examName = response;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching exam name', err);
        },
      });
  }

  //  When Card Clicked
  openSittingPlan() {
    this.showSittingPlan = true;
    this.loadSeats();
  }

  //  Load Seat Data
  loadSeats() {

    this.loading = true;

    this.http
      .get<any[]>(
        `http://localhost:8080/api/university/getSeatBYCollege/${this.collegeId}/${this.examId}`,
        { withCredentials: true }
      )
      .subscribe({
        next: (response) => {

          if (!response || response.length === 0) {
            this.loading = false;
            return;
          }

          this.students = response.map((seat) => ({
            enrollment: seat.enrollmentNo,
            roomId: seat.room_id,
            row: seat.row_no + 1,
            column: seat.col_no + 1,
          }));

          this.filteredStudents = [...this.students];

          const roomMap = new Map();

          this.students.forEach(s => {
            if (!roomMap.has(s.roomId)) {
              roomMap.set(s.roomId, { roomId: s.roomId });
            }
          });

          this.uniqueRooms = Array.from(roomMap.values());

          this.selectedRoom = this.uniqueRooms[0];
          this.roomid = this.selectedRoom.roomId;

          this.generateGrid();
          this.getRoomInformation();

          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  generateGrid() {

    const roomStudents = this.filteredStudents.filter(
      (s) => s.roomId === this.roomid
    );

    if (roomStudents.length === 0) {
      this.rows = [];
      this.columns = [];
      return;
    }

    const maxRow = Math.max(...roomStudents.map((s) => s.row));
    const maxCol = Math.max(...roomStudents.map((s) => s.column));

    this.rows = Array.from({ length: maxRow }, (_, i) => i + 1);
    this.columns = Array.from({ length: maxCol }, (_, i) => i + 1);
  }

  changeRoom(room: any) {
    this.roomid = room.roomId;
    this.generateGrid();
    this.getRoomInformation();
  }

  getStudent(row: number, column: number) {
    return this.filteredStudents.find(
      (s) =>
        s.roomId === this.roomid &&
        s.row === row &&
        s.column === column
    );
  }

  searchStudent() {

    if (!this.searchText) {
      this.filteredStudents = [...this.students];
    } else {
      this.filteredStudents = this.students.filter((s) =>
        s.enrollment.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }

    this.generateGrid();
  }

  getOccupiedCount() {
    return this.students.filter(s => s.roomId === this.roomid).length;
  }

  getEmptySeats() {
    return this.capacity - this.getOccupiedCount();
  }

  getRoomInformation() {

    if (!this.roomid) return;

    this.http
      .get<any>(
        `http://localhost:8080/api/colleges/getRoomInfo/${this.collegeId}/${this.roomid}`,
        { withCredentials: true }
      )
      .subscribe({
        next: (response) => {
          this.roomNumber = response.roomNumber;
          this.capacity = response.capacity;
          this.cdr.detectChanges();
        },
      });
  }
}