import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-university-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './university-dashboard.html',
  styleUrls: ['./university-dashboard.css'],
})
export class UniversityDashboardComponent implements OnInit {

  userName: string | null = '';
  role: string | null = '';

  constructor(private router: Router) {}

  ngOnInit(): void {

    this.userName = localStorage.getItem('userName');
    this.role = localStorage.getItem('userRole');

    // Safety check
    if (!this.role || this.role !== 'university') {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
