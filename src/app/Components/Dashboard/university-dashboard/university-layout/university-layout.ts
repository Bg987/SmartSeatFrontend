import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-university-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './university-layout.html',
  styleUrls: ['./university-layout.css'],
})
export class UniversityLayoutComponent {

  universityName: string | null = '';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    // role check
    if (localStorage.getItem('userRole') !== 'university') {
      this.router.navigate(['/']);
    }

    this.universityName = localStorage.getItem('userName');
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
}
