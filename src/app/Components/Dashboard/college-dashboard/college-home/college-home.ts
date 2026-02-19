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
  totalStudents = 0;
  totalRooms = 0;
  totalSittingPlans = 6;

  students: any[] = [];
  rooms: any[] = [];

  showStudentsTable = true;
  showRoomsTable = false;

  // Rooms Pagination
  roomPage = 0;
  roomSize = 5;
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
    this.getStudent.getStudents().subscribe((res) => {
      this.students = res;
      this.totalStudents = this.students.length;
      console.log(this.totalStudents);
      this.cd.detectChanges();
    });
  }

  loadRoomsData() {
    this.getRoom.getRooms(this.roomPage, this.roomSize).subscribe((res) => {
      this.rooms = res; 

      console.log(this.rooms);//Total rooms count


      this.totalRooms = this.rooms.length,

      console.log(this.totalRooms);//Total rooms count


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
