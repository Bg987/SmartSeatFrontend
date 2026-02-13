import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-college-layout',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl:'college-layout.html',
  styleUrl:'college-layout.css'
})
export class CollegeLayoutComponent implements OnInit {
  userName: string | null = '';
  role: string | null = '';

  constructor(private router: Router) {}

  ngOnInit(): void {

    this.userName = localStorage.getItem('userName');
    this.role = localStorage.getItem('userRole');

    // Safety check
    if (!this.role || this.role !== 'college') {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
