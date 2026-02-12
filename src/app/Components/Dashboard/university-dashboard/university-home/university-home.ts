import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-university-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './university-home.html',
  styleUrls: ['./university-home.css']
})
export class UniversityHomeComponent implements OnInit {

  universityName: string | null = '';
  colleges$!: Observable<any[]>;;
  loading = false;
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.universityName = localStorage.getItem('userName');
    this.colleges$ = this.http.get<any[]>(
      'http://localhost:8080/api/university/colleges',
      { withCredentials: true }
    );
  }
}
