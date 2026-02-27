import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ChangeDetectorRef } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-get-time-table-college',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './get-time-table-college.html',
  styleUrl: './get-time-table-college.css',
})
export class GetTimeTableCollege {
  private url = environment.apiUrl;
  form: FormGroup;
  timetableData: any[] = [];

  branches = ['CSE', 'IOT', 'EE', 'EC', 'AIML', 'ME', 'CE'];
  semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];

  constructor(private fb: FormBuilder, private http: HttpClient,
   private cdr:ChangeDetectorRef,
   
  ) {

    this.form = this.fb.group({
      branch: ['', Validators.required],
      semester: [{ value: '', disabled: true }, Validators.required]
      
    });

    this.form.get('branch')?.valueChanges.subscribe(value => {
      if (value) {
        this.form.get('semester')?.enable();
      } else {
        this.form.get('semester')?.disable();
      }
    });
  }

  submit() {
    if (this.form.valid) {


      const branch = this.form.get('branch')?.value;
      const semester = this.form.get('semester')?.value;

      this.http.get<any[]>(`${this.url}/colleges/getTimetable/${branch}/${semester}`,{
        withCredentials:true
      })
        .subscribe({
          next: (res) => {
            this.timetableData = res;
            this.cdr.detectChanges();
            if(this.timetableData.length<1)
            {
              alert("Sorry Time table not available");
            }
            else{
              alert("Time table recieved...");
            }
            
          },
          error: (err) => {
            console.error(err);
            alert("No timetable found");
          }

        
        });
    }
  }

  downloadPDF() {

    const doc = new jsPDF();

    const tableData = this.timetableData.map(item => [
      item.subjectId,
      item.subjectName,
      item.examDate,
      item.branch,
      item.semester
    ]);

    autoTable(doc, {
      head: [['Subject ID', 'Subject Name', 'Exam Date', 'Branch', 'Semester']],
      body: tableData
    });

    doc.save('Timetable.pdf');
  }
}