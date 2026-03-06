import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

export interface ExamDetail {
  id: number;
  examName: string;
}

@Component({
  selector: 'app-sitting-plan',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './sitting-plan.html',
  styleUrl: './sitting-plan.css',
})
export class SittingPlan implements OnInit {
  // Data Sources
  students: any[] = [];
  filteredStudents: any[] = [];
  examList: ExamDetail[] = [];
  allCollegeRooms: any[] = [];
  uniqueRooms: any[] = [];
  
  // Grid Logic
  rows: number[] = [];
  columns: number[] = [];
  
  // State Management
  url: String = environment.apiUrl;
  searchText: string = '';
  loading = false;
  showSittingPlan = false;

  // Identity & Selections
  collegeId = Number(localStorage.getItem('collegeId'));
  examId!: Number;
  examName: string = '';
  selectedRoom: any = null;
  roomid!: number;
  
  // Room Info Display
  roomNumber!: number;
  blockName!: string;
  capacity: number = 0;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getExamDetails();
    this.getAllCollegeRooms();
  }

  getAllCollegeRooms() {
    this.http.get<any[]>(`${this.url}/colleges/getRoomInfoOfCollege`, { withCredentials: true })
      .subscribe(res => { 
        this.allCollegeRooms = res; 
        this.cdr.detectChanges();
      });
  }

  isRoomAllocated(roomId: number): boolean {
    return this.uniqueRooms.some(r => r.roomId === roomId);
  }

  getExamDetails() {
    this.http.get<ExamDetail[]>(`${this.url}/colleges/getExamDetails`, { withCredentials: true })
      .subscribe({
        next: (res) => { this.examList = res; this.cdr.detectChanges(); },
        error: (err) => console.error('Exam Fetch Error:', err)
      });
  }

  openSittingPlan(id: Number) {
    const selected = this.examList.find(e => e.id === id);
    this.examName = selected ? selected.examName : 'Sitting Plan';
    this.showSittingPlan = true;
    this.loadSeats(id);
  }

  loadSeats(id: Number) {
    this.examId = id;
    this.loading = true;
    this.http.get<any[]>(`${this.url}/university/getSeatBYCollege/${this.examId}`, { withCredentials: true })
      .subscribe({
        next: (response) => {
          if (!response || response.length === 0) {
            this.students = []; this.uniqueRooms = []; this.rows = [];
            this.loading = false; return;
          }

          this.students = response.map(seat => ({
            enrollment: seat.enrollmentNo,
            roomId: seat.room_id,
            row: seat.row_no + 1,
            column: seat.col_no + 1,
          }));

          this.filteredStudents = [...this.students];
          
          const roomMap = new Map();
          this.students.forEach(s => {
            if (!roomMap.has(s.roomId)) roomMap.set(s.roomId, { roomId: s.roomId });
          });
          this.uniqueRooms = Array.from(roomMap.values());

          // INITIALIZATION: Render first room automatically
          if (this.uniqueRooms.length > 0) {
            this.roomid = this.uniqueRooms[0].roomId;
            this.selectedRoom = { roomId: this.roomid }; 
            
            // Sync all UI sections for the first room
            this.getRoomInformation();
            this.generateGrid();
          }

          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => this.loading = false
      });
  }

  generateGrid() {
    const roomStudents = this.filteredStudents.filter(s => s.roomId === this.roomid);
    if (roomStudents.length === 0) {
      this.rows = []; this.columns = []; return;
    }
    const maxRow = Math.max(...roomStudents.map(s => s.row));
    const maxCol = Math.max(...roomStudents.map(s => s.column));
    this.rows = Array.from({ length: maxRow }, (_, i) => i + 1);
    this.columns = Array.from({ length: maxCol }, (_, i) => i + 1);
  }

  changeRoom(event: any) {
    if (event && event.roomId) {
      this.roomid = event.roomId;
      
      // Reset grid while switching to prevent data ghosting
      this.rows = [];
      this.columns = [];

      this.getRoomInformation();
      this.generateGrid();
    }
  }

  getStudent(row: number, column: number) {
    return this.filteredStudents.find(s => s.roomId === this.roomid && s.row === row && s.column === column);
  }

  searchStudent() {
    this.filteredStudents = !this.searchText ? [...this.students] : 
      this.students.filter(s => s.enrollment.toLowerCase().includes(this.searchText.toLowerCase()));
    this.generateGrid();
  }

  getOccupiedCount() { return this.students.filter(s => s.roomId === this.roomid).length; }
  getEmptySeats() { return Math.max(0, this.capacity - this.getOccupiedCount()); }

  getRoomInformation() {
    if (!this.roomid) return;
    this.http.get<any>(`${this.url}/colleges/getRoomInfo/${this.roomid}`, { withCredentials: true })
      .subscribe(res => {
        this.roomNumber = res.roomNumber;
        this.blockName = res.block ? res.block : 'Main';
        this.capacity = res.capacity;
        this.cdr.detectChanges();
      });
  }
}