import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-college-analytics-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './college-analytics-component.html',
  styleUrl: './college-analytics-component.css',
})
export class CollegeAnalyticsComponent {
  // Initialize as null so *ngIf can handle it
  @Input() analyticsData: any = null; 

  // Helper to safely get grade keys for the template
  getGradeKeys() {
    return this.analyticsData?.gradeBreakdown ? Object.keys(this.analyticsData.gradeBreakdown) : [];
  }
}