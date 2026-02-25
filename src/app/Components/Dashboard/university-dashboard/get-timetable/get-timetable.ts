import { Component, Input } from '@angular/core';
import { GetTimetableService } from '../../../../services/get-timetable-service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-get-timetable',
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './get-timetable.html',
  styleUrl: './get-timetable.css',
})
export class GetTimetable {

  @Input() batchId!: string;

  constructor(
    private service:GetTimetableService,
    private cdr:ChangeDetectorRef
  )
  {}

  
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
      this.cdr.detectChanges(); 
    });
    
}

 downloadTimetable() {

  if (this.timeTable.length === 0) {
    alert("No data to download");
    return;
  }

  // ===== Get data from localStorage =====
  const storedData = JSON.parse(localStorage.getItem("subjectsResponse") || "[]");

  let department = "";
  let branch = "";
  let semester = "";

  if (storedData.length > 0) {
    department = storedData[0].department;
    branch = storedData[0].branch;
    semester = storedData[0].semester;
  }

  // ===== Create Exam Name =====
  const examName = `${department}_${branch}_${semester} Exam`;

  const doc = new jsPDF();

  // ===== Page Border =====
  doc.setDrawColor(0);
  doc.rect(5, 5, 200, 287);

  // ===== Title =====
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Exam Timetable", 105, 15, { align: "center" });

  // ===== Exam Details =====
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Exam Name: ${examName}`, 14, 25);
  doc.text(`Department: ${department}`, 14, 32);
  doc.text(`Branch: ${branch}`, 14, 39);
  doc.text(`Semester: ${semester}`, 14, 46);
  doc.text(`Batch ID: ${this.batchId}`, 14, 53);

  // ===== Table =====
  autoTable(doc, {
    startY: 60,

    head: [['Subject ID', 'Subject Name', 'Exam Date']],

    body: this.timeTable.map(item => [
      item.subjectId,
      item.subjectName,
      item.examDate
    ]),

    theme: 'grid',

    styles: {
      fontSize: 11,
      halign: 'center',
      valign: 'middle',
      lineWidth: 0.3,
      lineColor: [0, 0, 0]
    },

    headStyles: {
      fillColor: [41, 128, 185],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },

    alternateRowStyles: {
      fillColor: [240, 240, 240]
    }
  });

  doc.save(`TimeTable_${examName}.pdf`);
}


}
