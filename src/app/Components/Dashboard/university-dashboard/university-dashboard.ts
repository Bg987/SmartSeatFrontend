import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-university-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './university-dashboard.html',
  styleUrls: ['./university-dashboard.css'],
})
export class UniversityDashboardComponent implements OnInit {

  universityName: string | null = '';
  colleges: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {

    //  role check
    if (localStorage.getItem('userRole') !== 'university') {
      this.router.navigate(['/']);
      return;
    }

    this.universityName = localStorage.getItem('userName');

    // 🔹 pehle localStorage se try karo
    const storedColleges = localStorage.getItem('colleges');
    if (storedColleges) {
      this.colleges = JSON.parse(storedColleges);
    }

    // 🔹 backend se fresh data lao
    this.fetchColleges();
  }

  fetchColleges() {
    this.loading = true;

    this.http.get<any[]>(
      'http://localhost:8080/api/university/colleges',
      { withCredentials: true }
    ).subscribe({
      next: (data) => {
        this.colleges = data;

        //  localStorage me save
        localStorage.setItem('colleges', JSON.stringify(data));

        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load colleges';
        this.loading = false;
      }
    });
  }

  logout() {
    this.http.post(
      'http://localhost:8080/api/auth/logout',
      {},
      { withCredentials: true }
    ).subscribe({
      next: () => this.clearAndRedirect(),
      error: () => this.clearAndRedirect()
    });
  }

  clearAndRedirect() {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  }

  addCollege() {
    alert('Add College form will open here');
  }
}
