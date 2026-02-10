import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl:'student-dashboard.html',
  styleUrl:'student-dashboard.css'
})
export class StudentDashboardComponent implements OnInit {
  userName: string | null = '';
  role: string | null = '';

  constructor(private router: Router) {}

  ngOnInit(): void {

    this.userName = localStorage.getItem('userName');
    this.role = localStorage.getItem('userRole');

    // Safety check
    if (!this.role || this.role !== 'student') {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
