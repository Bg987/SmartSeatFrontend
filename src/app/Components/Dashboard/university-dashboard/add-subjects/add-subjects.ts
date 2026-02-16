import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddSubjectService } from '../../../../services/add-subject-service';

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
  responseMessage= '';
  subjects: any[] = [];
  isLoading: boolean = false;

  // File Upload Variables
  selectedFile: File | null = null;
  uploadMessage: string = '';
  activeTab: string = 'manual';

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

  // load Subjects
  loadSubjects(): void {

    this.isLoading = true;

    this.subjectService.getAllSubjects()
      .subscribe({
        next: (res: any) => {

       //   console.log("RAW RESPONSE:", res);

          if (Array.isArray(res)) {
            this.subjects = res;
          } else if (res) {
            this.subjects = [res];
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

  // Add Subject
  onSubmit(): void {

    if (this.subjectForm.invalid) {
      this.responseMessage = 'Please fill all required fields';
      return;
    }

    this.subjectService.addSubject(this.subjectForm.value)
      .subscribe({
        next: (res: any) => {

          this.responseMessage = "Subject added successfully ✅";
          this.subjectForm.reset();
          this.loadSubjects();
        },
        error: (err) => {
          console.error('Error adding subject:', err.error);
          const errorObj = typeof err.error === 'string' ? JSON.parse(err.error) : err.error;

          //Extract values and join them into a single message (or keep as array)
          this.responseMessage = Object.values(errorObj).join(', ');
          this.cdr.detectChanges();
        }
      });
  }

  //File Select
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.uploadMessage = '';
    }
  }

  //  Upload File
  uploadFile(): void {

    if (!this.selectedFile) {
      this.uploadMessage = "Please select a file first";
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.subjectService.uploadSubjectFile(formData)
      .subscribe({
        next: (res: any) => {

          this.uploadMessage = "File uploaded successfully ";
          this.selectedFile = null;

        },
        error: (err) => {
          console.error(err);
          this.uploadMessage = "File upload failed ";
        }
      });
  }

}
