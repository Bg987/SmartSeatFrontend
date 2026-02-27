import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-show-college-detail',
  standalone: true,              
  imports: [CommonModule,RouterLink],
  templateUrl: './show-college-detail.html',
  styleUrls: ['./show-college-detail.css'],
})
export class ShowCollegeDetail {
  private url = environment.apiUrl;
  college: any;
  userId: any;
  studentCount:any;
  roomCount:any;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr:ChangeDetectorRef
  ) {}

  ngOnInit() {
  this.userId = this.route.snapshot.paramMap.get('userId');

  this.http.get(
    `${this.url}/university/showCollegeDetail/${this.userId}`,
    { withCredentials: true }
  ).subscribe(res => {

    this.college = res;
    localStorage.setItem('collegeId',this.college.collegeId)
    console.log(this.college);

    // Second API for getting student count of college--
    this.http.get(
      `${this.url}/university/getCountOfStudents/${this.college.collegeId}`,
      { withCredentials: true }
    ).subscribe(countRes => {
      this.studentCount = countRes;
      console.log("Student Count:", this.studentCount);
      this.cdr.detectChanges();
    });


    // Third API for getting rooms count of college--
    this.http.get(
      `${this.url}/university/getCountOfRooms/${this.college.collegeId}`,
      { withCredentials: true }
    ).subscribe(countRoom => {
      this.roomCount = countRoom;
      console.log(" Total Room Count:", this.roomCount);
      this.cdr.detectChanges();
    });

    

  });
}
}