import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GetStudents } from '../../../../services/get-students';
import { GetRooms } from '../../../../services/get-rooms';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-college-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './college-home.html',
  styleUrls: ['./college-home.css'],
})
export class CollegeHome implements OnInit {
  //default values
  totalStudents = 0;
  totalRooms = 0;
  totalSittingPlans = 0;

  students: any[] = [];
  rooms: any[] = [];

  showStudentsTable = true;
  showRoomsTable = false;

  // Rooms Pagination
  roomPage = 0;
  roomSize = 1;
  totalRoomPages = 0;

  constructor(
    private getStudent: GetStudents,
    private getRoom: GetRooms,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadStudentsData(); // load students + count
    this.loadRoomsData(); // load rooms + count
  }

  // Load Students
  loadStudentsData() {
  this.getStudent.getStudents().subscribe({
    next: (rawRes: string) => {
      try {
        // Find the last valid closing bracket of the JSON array
        const lastBracket = rawRes.lastIndexOf(']');
        
        if (lastBracket !== -1) {
          // Slice the string to remove the "could not initialize proxy" text
          const cleanJson = rawRes.substring(0, lastBracket + 1);
          
          this.students = JSON.parse(cleanJson);
          console.log("Cleaned Data:", this.students);
          
          // Now detectChanges will actually have data to work with
          this.cd.detectChanges();
        }
      } catch (e) {
        console.error("Manual JSON parse failed:", e);
      }
    },
    error: (err) => {
      // This is where your code was likely ending up before
      console.error("HTTP Error detected:", err);
    }
  });
}

  loadRoomsData() {
    this.getRoom.getRooms(this.roomPage, this.roomSize).subscribe((res) => {
      this.rooms = res; 

      console.log(this.rooms);//Total rooms count


      this.totalRooms = this.rooms.length,

      console.log(this.totalRooms);//Total rooms count


      this.rooms = res.content; // current page data
      console.log();
      this.totalRooms = res.totalElements; // total count from DB
      this.totalRoomPages = res.totalPages;
      console.log(this.totalRoomPages);

      this.cd.detectChanges();
    });
  }

  // Card Click: Only Toggle
  loadStudents() {
    this.showStudentsTable = true;
    this.showRoomsTable = false;
  }

  loadRooms() {
    this.showStudentsTable = false;
    this.showRoomsTable = true;
  }

  nextRoomPage() {
    if (this.roomPage < this.totalRoomPages - 1) {
      this.roomPage++;
      this.loadRoomsData();
    }
  }

  prevRoomPage() {
    if (this.roomPage > 0) {
      this.roomPage--;
      this.loadRoomsData();
    }
  }
}