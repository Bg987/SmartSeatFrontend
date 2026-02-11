import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-university-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './university-home.html',
  styleUrls: ['./university-home.css']
})
export class UniversityHomeComponent implements OnInit {

  universityName: string | null = '';
  colleges: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {

    const storedColleges = localStorage.getItem('colleges');
     this.universityName = localStorage.getItem('userName');
     
    localStorage.getItem('')
    if (storedColleges) {
      this.colleges = JSON.parse(storedColleges);
    }

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
        localStorage.setItem('colleges', JSON.stringify(data));
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load colleges';
        this.loading = false;
      }
    });
  }
}
