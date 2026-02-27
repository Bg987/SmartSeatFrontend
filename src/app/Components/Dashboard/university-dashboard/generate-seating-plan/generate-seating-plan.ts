import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { ChangeDetectorRef } from '@angular/core';
import { environment } from '../../../../../environments/environment';

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
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './generate-seating-plan.html',
  styleUrls: ['./generate-seating-plan.css']
})
export class GenerateSeatingPlan {

  private url = environment.apiUrl;
  message = '';
  loading = false;
  seats: Seat[] = [];
  generatedCollegeId: number | null = null;
  subject:string ='';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cdr:ChangeDetectorRef
  ) {}

  // Get collegeId from localStorage
  private getCollegeId(): number | null {
    const id = localStorage.getItem('collegeId');
    return id ? Number(id) : null;
  }

  // POST: generate seating plan
  generatePlan() {

    const collegeId = this.getCollegeId();

    if (!collegeId) {
      alert("College ID not found. Please login again.");
      return;
    }

    this.loading = true;
    this.message = '';

    this.http.post(
      `${this.url}/university/allocate/${collegeId}/${this.subject}`,
      {},
      { withCredentials: true, responseType: 'text' as 'json' }
    ).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.message = res;
        this.generatedCollegeId = collegeId;
        alert(res);

        this.getPlan(collegeId);

        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.message = 'Error generating seating plan.';
        alert("Error in generating seating plan.");
      }
    });
  }

  // GET: fetch seating plan
  getPlan(collegeId?: number) {

    const id = collegeId ?? this.getCollegeId();

    if (!id) {
      alert("College ID not found.");
      return;
    }

    this.http.get<Seat | Seat[]>(
      `${this.url}/university/getSeattingPlan/${id}`,
      { withCredentials: true }
    ).subscribe({
      next: (res: any) => {
        this.seats = Array.isArray(res) ? res : [res];
      },
      error: () => {
        alert("Error fetching seating plan.");
      }
    });
  }

  // PDF Download
  downloadPDF() {

    if (!this.seats || this.seats.length === 0) {
      alert("No seating data available.");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Seating Plan", 14, 15);

    const tableColumn = [
      "Enrollment No",
      "Name",
      "Branch",
      "Semester",
      "Room",
      "Row",
      "Column"
    ];

    const tableRows: any[] = [];

    this.seats.forEach(seat => {
      tableRows.push([
        seat.enrollmentNo,
        seat.name,
        seat.branch,
        seat.semester ?? '-',
        seat.room_id,
        seat.row,
        seat.column
      ]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 }
    });

    doc.save("Seating-Plan.pdf");
  }

}