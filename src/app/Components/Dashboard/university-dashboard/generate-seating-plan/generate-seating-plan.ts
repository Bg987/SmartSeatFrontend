import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';

interface Seat {
  enrollmentNo: string;
  name: string;
  branch: string;
  semester: number | null;
  room_id: number;
  row: number;
  column: number;
}

@Component({
  selector: 'app-seating-plan',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './generate-seating-plan.html',
  styleUrls: ['./generate-seating-plan.css']
})
export class GenerateSeatingPlan {

  seatingForm: FormGroup;
  message = '';
  loading = false;
  seats: Seat[] = [];  // store fetched seats
  generatedCollegeId: number | null = null;   

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.seatingForm = this.fb.group({
      collegeId: ['', Validators.required]
    });
  }

  // POST: generate seating plan
  generatePlan() {
    if (this.seatingForm.invalid) return;

    const collegeId = this.seatingForm.value.collegeId;

    this.loading = true;
    this.message = '';

    this.http.post(
      `http://localhost:8080/api/university/allocate/${collegeId}`,
      {}, 
      { withCredentials: true, responseType: 'text' as 'json' }
    ).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.message = res;
        this.generatedCollegeId = collegeId;
        alert(res);

        // Automatically fetch plan after generation
        this.getPlan(collegeId);
      },
      error: () => {
        this.loading = false;
        this.message = 'Error generating seating plan.';
        alert("Error in generating seating plan.");
      }
    });
  }

  // GET: fetch seating plan
  getPlan(collegeId: number) {
    this.http.get<Seat | Seat[]>(
      `http://localhost:8080/api/university/getSeattingPlan/${collegeId}`,
      { withCredentials: true }
    ).subscribe({
      next: (res: any) => {
        // If API returns a single object, wrap it in array
        this.seats = Array.isArray(res) ? res : [res];
      },
      error: () => {
        alert("Error fetching seating plan.");
      }
    });
  }

}