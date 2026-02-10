import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-college-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1> College Dashboard</h1>
    <p>Welcome College Admin</p>
  `
})
export class CollegeDashboardComponent {}
