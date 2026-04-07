import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing-page.html',
  styleUrls: ['./landing-page.css']
})
export class LandingPage {
  // Features derived from your backend capabilities
  features = [
    {
      title: 'Distributed Control',
      desc: 'Synchronized management between University and affiliated Colleges with secure role-based access.',
      icon: '🌐'
    },
    {
      title: 'Smart Allocation',
      desc: 'AI algorithms that generate randomized, cheat-proof seating plans based on room capacity and subject codes.',
      icon: '🤖'
    },
    {
      title: 'Live Analytics',
      desc: 'Real-time tracking of attendance, exam completion status, and student performance metrics.',
      icon: '📊'
    },
    {
      title: 'Data-Driven Insights',
      desc: 'Automated generation of grade breakdowns and statistical analysis for institutional excellence.',
      icon: '🧠'
    }
  ];

  focusAreas = [
    'Secure JWT Authentication',
    'Automated Seat Mapping',
    'Cross-College Coordination',
    'Scalable Microservices'
  ];
}