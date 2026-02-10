import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>🎓 Student Dashboard</h1>
    <p>Welcome Student</p>
  `
})
export class StudentDashboardComponent {}
