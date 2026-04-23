import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

export interface ExamSlot {
  examDate: string;
  startTime: string;
  exams: any[];
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
  examList: ExamSlot[] = [];
  occupiedRooms: any[] = [];
  students: any[] = [];
  filteredStudents: any[] = [];
  allCollegeRooms: any[] = [];
  uniqueRooms: any[] = [];
  
  // State
  url: String = environment.apiUrl;
  showSittingPlan = false;
  showRoomList = false;
  loading = false;
  searchText: string = '';

  // Current Selections
  selectedSlotLabel: string = '';
  examId!: number;
  examName: string = '';
  roomid!: number;
  selectedRoom: any = null;

  // Grid Info
  rows: number[] = [];
  columns: number[] = [];
  roomNumber: number=-1;
  blockName: string='';
  capacity: number = 0;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getExamDetails();
    this.getAllCollegeRooms();
  }

  getExamDetails() {
    this.http.get<any[]>(`${this.url}/colleges/getExamDetails`, { withCredentials: true })
      .subscribe(res => { this.examList = res; this.cdr.detectChanges(); });
  }

  openRoomAudit(slot: ExamSlot) {
    this.selectedSlotLabel = `${slot.examDate} @ ${slot.startTime}`;
    this.showRoomList = true;
    this.showSittingPlan = false;
    this.loading = true;
    this.http.get<any[]>(`${this.url}/colleges/getRoomsBySlot`, { 
      params: { date: slot.examDate, time: slot.startTime }, 
      withCredentials: true 
    }).subscribe(res => {
      this.occupiedRooms = res || [];
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  openSittingPlan(id: number, name: string) {
    this.examId = id;
    this.examName = name;
    this.showSittingPlan = true;
    this.showRoomList = false;
    this.loadSeats(id);
  }

  loadSeats(id: number) {
    this.loading = true;
    this.http.get<any[]>(`${this.url}/colleges/getSeatBYCollege/${id}`, { withCredentials: true })
      .subscribe(response => {
        this.students = response.map(seat => ({
          enrollment: seat.enrollmentNo,
          roomId: Number(seat.room_id),
          row: Number(seat.row_no) + 1,
          column: Number(seat.col_no) + 1,
        }));
        this.filteredStudents = [...this.students];
        const roomMap = new Map();
        this.students.forEach(s => roomMap.set(s.roomId, { roomId: s.roomId }));
        this.uniqueRooms = Array.from(roomMap.values());
        if (this.uniqueRooms.length > 0) {
          this.roomid = this.uniqueRooms[0].roomId;
          this.selectedRoom = { roomId: this.roomid }; 
          this.getRoomInformation();
          this.generateGrid();
        }
        this.loading = false;
        this.cdr.detectChanges();
      });
  }

  generateGrid() {
    const roomStudents = this.filteredStudents.filter(s => s.roomId === this.roomid);
    if (roomStudents.length === 0) { this.rows = []; this.columns = []; return; }
    this.rows = Array.from({ length: Math.max(...roomStudents.map(s => s.row)) }, (_, i) => i + 1);
    this.columns = Array.from({ length: Math.max(...roomStudents.map(s => s.column)) }, (_, i) => i + 1);
  }

  getStudent(r: number, c: number) {
    return this.filteredStudents.find(s => s.roomId === this.roomid && s.row === r && s.column === c);
  }

  changeRoom(event: any) {
    this.roomid = event.roomId;
    this.getRoomInformation();
    this.generateGrid();
  }

  getAllCollegeRooms() {
    this.http.get<any[]>(`${this.url}/colleges/getRoomInfoOfCollege`, { withCredentials: true }).subscribe(res => this.allCollegeRooms = res);
  }

  getRoomInformation() {
    this.http.get<any>(`${this.url}/colleges/getRoomInfo/${this.roomid}`, { withCredentials: true }).subscribe(res => {
      this.roomNumber = res.roomNumber; this.blockName = res.block || 'Main'; this.capacity = res.capacity;
      this.cdr.detectChanges();
    });
  }

  searchStudent() {
    this.filteredStudents = !this.searchText ? [...this.students] : 
      this.students.filter(s => s.enrollment.toLowerCase().includes(this.searchText.toLowerCase()));
    this.generateGrid();
  }
  
  isRoomAllocated(roomId: number) { return this.uniqueRooms.some(r => r.roomId === roomId); }
  getOccupiedCount() { return this.students.filter(s => s.roomId === this.roomid).length; }
  getEmptySeats() { return Math.max(0, this.capacity - this.getOccupiedCount()); }
}