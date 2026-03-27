import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-generate-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './generate-result.html',
  styleUrl: './generate-result.css',
})
export class GenerateResult implements OnInit {
  
  url = environment.apiUrl;
  url2 = environment.apiUrl2;
  exams: any;
  isLoading = true;
  isProcessing = false;

  constructor(private cdr: ChangeDetectorRef,
    private http : HttpClient
  ){}
  ngOnInit() {
    this.fetchExams();
  }

  fetchExams() {
    this.http.get<any[]>(`${this.url}/university/getExamForGrading`, {
      withCredentials : true,
    })
      .subscribe({
        next: (data) => {
      // Check if data is actually an array or the "Not found" string
          if (Array.isArray(data)) {
            this.exams = data;
          } else {
            this.exams = []; // Force empty array so *ngIf/ @for works
            console.warn("Backend returned message:", data);
          }
          
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching exams', err);
          this.isLoading = false;
        }
      });
  }

  generateResult(timetableId: number) {
  this.isProcessing = true;
  console.log('Starting grading for ID:', timetableId);

  // We add { responseType: 'text' } because your Backend returns a String, not a JSON object
  this.http.post(`${this.url2}/exam/generate/${timetableId}`, {}, {
    withCredentials: true,
    responseType: 'text' 
  })
  .subscribe({
    next: (res: string) => {
      console.log('Server Response:', res);
      
      // Optional: Show a nice toast or alert with the actual message from Java
      alert(res); 

      // Refresh the list - the exam will now have 'completed: true' and disappear
      this.fetchExams(); 
      
      this.isProcessing = false;
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Grading Error:', err);
      alert('Grading failed: ' + (err.error || 'Server Error'));
      this.isProcessing = false;
      this.cdr.detectChanges();
    }
  });
}
}