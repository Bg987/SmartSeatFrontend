import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddSubjectService } from '../../../../services/add-subject-service';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-add-subject',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-subjects.html',
  styleUrls: ['./add-subjects.css']
})
export class AddSubjects implements OnInit {

  subjectForm!: FormGroup;
  responseMessage: string = '';
  subjects: any[] = [];
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private subjectService: AddSubjectService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadSubjects();
  }

  initializeForm(): void {
    this.subjectForm = this.fb.group({
      subjectId: ['', Validators.required],
      subjectName: ['', Validators.required]
    });
  }

  
  loadSubjects(): void {

    this.isLoading = true;

    this.subjectService.getAllSubjects()
      .subscribe({
        next: (res: any) => {

          console.log("RAW RESPONSE:", res);

          
          if (Array.isArray(res)) {
            this.subjects = res;
          } else if (res) {
            this.subjects = [res];  // wrap single object into array
          } else {
            this.subjects = [];
          }

          this.isLoading = false;
           this.cdr.detectChanges(); 
        },
        error: (err) => {
          console.error('Error loading subjects:', err);
          this.subjects = [];
          this.isLoading = false;
        }
      });
  }

  onSubmit(): void {

    if (this.subjectForm.invalid) {
      this.responseMessage = 'Please fill all required fields';
      return;
    }

    this.subjectService.addSubject(this.subjectForm.value)
      .subscribe({
        next: (res: any) => {

          console.log('Backend Response:', res);

          this.responseMessage = res;
          this.subjectForm.reset();

          // Reload subjects properly
          this.loadSubjects();
        },
        error: (err) => {
          console.error('Error adding subject:', err);
          this.responseMessage = 'Failed to add subject';
        }
      });
  }

}
