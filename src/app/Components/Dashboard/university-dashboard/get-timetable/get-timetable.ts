import { Component } from '@angular/core';
import { GetTimetableService } from '../../../../services/get-timetable-service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-get-timetable',
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './get-timetable.html',
  styleUrl: './get-timetable.css',
})
export class GetTimetable {

  constructor(
    private service:GetTimetableService
  )
  {}

  batchId: string = '';
  timeTable:any[]=[];

getTimetable() {
  if (!this.batchId) {
    alert("Please enter batchId");
    return;
  }

  this.service.getTimetable(this.batchId)
    .subscribe(res => {
      console.log(res);
      this.timeTable=res;
    });
}

  downloadTimetable() {

  if (this.timeTable.length === 0) {
    alert("No data to download");
    return;
  }

  const doc = new jsPDF();

  // ===== Page Border =====
  doc.setDrawColor(0); // Black color
  doc.rect(5, 5, 200, 287); // x, y, width, height

  // ===== Title Styling =====
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Exam Timetable", 105, 15, { align: "center" });

  // ===== Exam Name =====
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Exam Name: Tmp Exam`, 14, 25);
  doc.text(`Batch ID: ${this.batchId}`, 14, 32);

  // ===== Table =====
  autoTable(doc, {
    startY: 40,

    head: [['Subject ID', 'Subject Name', 'Exam Date']],

    body: this.timeTable.map(item => [
      item.subjectId,
      item.subjectName,
      item.examDate
    ]),

    theme: 'grid', // Full borders

    styles: {
      fontSize: 11,
      halign: 'center',
      valign: 'middle',
      lineWidth: 0.3,
      lineColor: [0, 0, 0] // Black borders
    },

    headStyles: {
      fillColor: [41, 128, 185], // Blue header
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },

    alternateRowStyles: {
      fillColor: [240, 240, 240] // Light gray alternate rows
    }
  });

  doc.save(`TimeTable_${this.batchId}.pdf`);
}
}
