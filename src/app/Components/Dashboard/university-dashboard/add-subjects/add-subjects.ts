import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { FormsModule,FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddSubjectService } from '../../../../services/add-subject-service';

@Component({
  selector: 'app-add-subject',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './add-subjects.html',
  styleUrls: ['./add-subjects.css']
})
export class AddSubjects implements OnInit {

  subjectForm!: FormGroup;
  subjects: any[] = [];
  isLoading: boolean = false;

  // File Upload Variables
  selectedFile: File | null = null;
  responseMessage: string= '';
  uploadMessage: string = '';
  activeTab: string = 'manual';

  searchText: string = '';
  selectedDept: string = '';
  selectedBranch: string = '';
  selectedSem: string = '';

  selectedSubjects: any = [];

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
      subjectName: ['', Validators.required],
      department:['', Validators.required],
      branch:['',Validators.required],
      semester:['',Validators.required]
    });
  }

  // load Subjects
  loadSubjects(): void {
  this.isLoading = true;

  this.subjectService.getAllSubjects()
    .subscribe({
      next: (res: any) => {

        if (Array.isArray(res)) {
          this.subjects = [...res].reverse();
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
        this.cdr.detectChanges();
      }
    });
}

  // Add Subject
  onSubmit(): void {

  this.responseMessage = "";

  if (this.subjectForm.invalid) {
    this.responseMessage = 'Please fill all required fields';
    return;
  }

  this.isLoading = true;

  this.subjectService.addSubject(this.subjectForm.value)
    .subscribe({
      next: (res: any) => {

        this.responseMessage = "Subject added successfully ✅";
        this.subjectForm.reset();
        this.loadSubjects();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {

        console.error('Error adding subject:', err.error);
        const errorObj = typeof err.error === 'string'
          ? JSON.parse(err.error)
          : err.error;

        this.responseMessage = Object.values(errorObj).join(', ');
        this.isLoading = false;
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

  this.uploadMessage = "";

  if (!this.selectedFile) {
    this.uploadMessage = "Please select a file first";
    return;
  }

  this.isLoading = true;

  const formData = new FormData();
  formData.append('file', this.selectedFile);

  this.subjectService.uploadSubjectFile(formData)
    .subscribe({
      next: (res: any) => {
        this.selectedFile = null;
        this.uploadMessage = res.message;
        this.loadSubjects();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.uploadMessage = err.error.error;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get uniqueDepts() { return [...new Set(this.subjects.map(s => s.department))].filter(v => !!v); }
  get uniqueBranches() { return [...new Set(this.subjects.map(s => s.branch))].filter(v => !!v); }
  get uniqueSems() { return [...new Set(this.subjects.map(s => s.semester))].filter(v => !!v).sort(); }

  get filteredSubjects() {
    return this.subjects.filter(s => {
      const matchesSearch = !this.searchText || 
        s.subjectName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        s.subjectId.toLowerCase().includes(this.searchText.toLowerCase());
      return matchesSearch && 
             (!this.selectedDept || s.department === this.selectedDept) &&
             (!this.selectedBranch || s.branch === this.selectedBranch) &&
             (!this.selectedSem || s.semester?.toString() === this.selectedSem);
    });
  }
}
