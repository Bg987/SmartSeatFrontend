import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GetStudents } from '../../../../services/get-students';
import { GetRooms } from '../../../../services/get-rooms';

@Component({
  selector: 'app-college-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './college-home.html',
  styleUrls: ['./college-home.css'],
  // OnPush helps with stability during theme switches/DOM re-renders
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollegeHome implements OnInit {
  // Default values
  totalStudents = 0;
  totalRooms = 0;
  totalSittingPlans = 0;

  students: any[] = [];
  rooms: any[] = [];

  showStudentsTable = true;
  showRoomsTable = false;

  // Rooms Pagination
  roomPage = 0;
  roomSize = 5; // Increased default size for better UX
  totalRoomPages = 0;

  constructor(
    private getStudent: GetStudents,
    private getRoom: GetRooms,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadStudentsData();
    this.loadRoomsData();
  }

  /**
   * Loads student data and handles the "Proxy" string issue.
   * Note: It is highly recommended to fix the "hibernateLazyInitializer" 
   * on the Java backend to avoid this manual parsing.
   */
  loadStudentsData(): void {
    this.getStudent.getStudents().subscribe({
      next: (rawRes: any) => {
        try {
          // If the response is already an object/array, use it directly
          if (Array.isArray(rawRes)) {
            this.students = rawRes;
          } else if (typeof rawRes === 'string') {
            // Handle the case where Hibernate Proxy text is appended to JSON
            const lastBracket = rawRes.lastIndexOf(']');
            if (lastBracket !== -1) {
              const cleanJson = rawRes.substring(0, lastBracket + 1);
              this.students = JSON.parse(cleanJson);
            }
          }
          
          this.totalStudents = this.students.length;
          console.log("Students Loaded:", this.totalStudents);
        } catch (e) {
          console.error("Failed to parse student data:", e);
        } finally {
          this.cd.markForCheck(); // Trigger UI update
        }
      },
      error: (err) => console.error("HTTP Error (Students):", err)
    });
  }

  /**
   * Loads paginated room data.
   */
  loadRoomsData(): void {
    this.getRoom.getRooms(this.roomPage, this.roomSize).subscribe({
      next: (res: any) => {
        if (res) {
          // 'res.content' contains the list for the current page
          this.rooms = res.content || []; 
          this.totalRooms = res.totalElements || 0;
          this.totalRoomPages = res.totalPages || 0;
          
          console.log("Rooms Loaded. Total count:", this.totalRooms);
        }
        this.cd.markForCheck(); // Ensure UI reflects changes
      },
      error: (err) => console.error("HTTP Error (Rooms):", err)
    });
  }

  // --- UI View Toggles ---

  loadStudents(): void {
    this.showStudentsTable = true;
    this.showRoomsTable = false;
    this.cd.markForCheck();
  }

  loadRooms(): void {
    this.showStudentsTable = false;
    this.showRoomsTable = true;
    this.cd.markForCheck();
  }

  // --- Pagination Logic ---

  nextRoomPage(): void {
    if (this.roomPage < this.totalRoomPages - 1) {
      this.roomPage++;
      this.loadRoomsData();
    }
  }

  prevRoomPage(): void {
    if (this.roomPage > 0) {
      this.roomPage--;
      this.loadRoomsData();
    }
  }

  /**
   * If theme switching happens via a function in this component,
   * call this to ensure the data renders correctly after the CSS change.
   */
  onThemeSwitch(): void {
    setTimeout(() => {
      this.cd.detectChanges();
    }, 100);
  }
}