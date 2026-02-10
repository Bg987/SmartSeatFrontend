import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-university-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1> University Dashboard</h1>
    <p>Welcome University Admin</p>
  `
})
export class UniversityDashboardComponent {}
