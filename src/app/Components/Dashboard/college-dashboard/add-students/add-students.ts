import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddStudent } from '../../../../services/add-student';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-students.html',
  styleUrls: ['./add-students.css']
})
export class AddStudents implements OnInit {

  studentForm: FormGroup;
  showBacklogUI = false;   
  response: string = '';
  
  // Data for dropdowns
  branches: string[] = []; 
  loadingBranches = true;

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private studentService: AddStudent
  ) {
    this.studentForm = this.fb.group({
      enrollmentNo: ['', [Validators.required, Validators.minLength(5)]],
      name: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      branch: ['', Validators.required], // This will bind to our select dropdown
      specialization: [''],
      semester: [1, [Validators.required, Validators.min(1), Validators.max(8)]],
      subjects: this.fb.array([]),
      hasBacklog: [false],
      backlogSubjects: this.fb.array([])
    });

    // Handle Backlog UI visibility
    this.studentForm.get('hasBacklog')?.valueChanges.subscribe(value => {
      this.showBacklogUI = value;
      if (value) {
        if (this.backlogSubjects.length === 0) this.addBacklogSubject();
      } else {
        this.backlogSubjects.clear();
      }
    });
  }

  ngOnInit(): void {
    this.loadBranches();
  }

  // Load branches from the API via service
  loadBranches(): void {
    this.studentService.getSubjects().subscribe({
      next: (data) => {
        // Extract unique branch names from the subject list
        this.branches = [...new Set(data.map(item => item.branch))].sort();
        this.loadingBranches = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error fetching branches:", err);
        this.loadingBranches = false;
      }
    });
  }

  // -------- GETTERS --------
  get subjects(): FormArray {
    return this.studentForm.get('subjects') as FormArray;
  }

  get backlogSubjects(): FormArray {
    return this.studentForm.get('backlogSubjects') as FormArray;
  }

  // -------- SUBJECTS --------
  addSubject() {
    this.subjects.push(this.fb.control('', Validators.required));
  }

  removeSubject(index: number) {
    this.subjects.removeAt(index);
  }

  // -------- BACKLOG --------
  addBacklogSubject() {
    this.backlogSubjects.push(this.fb.control('', Validators.required));
  }

  removeBacklogSubject(index: number) {
    this.backlogSubjects.removeAt(index);
  }

  // -------- SUBMIT --------
  onSubmit() {
    this.response = "";
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      return;
    }

    const formValue = this.studentForm.value;
    const payload = {
      ...formValue,
      subjects: this.subjects.value,
      backlogSubjects: formValue.hasBacklog ? this.backlogSubjects.value : null   
    };

    this.studentService.addStudent(payload).subscribe({
      next: (res) => {
        this.response = res;
        this.resetForm();
        this.cdr.detectChanges();
      },
      error: (err) => {
        // Handle the error message thrown by the backend GlobalExceptionHandler
        this.response =  err.error;
        this.cdr.detectChanges();
      }
    });
  }

  private resetForm() {
    this.studentForm.reset({ semester: 1, hasBacklog: false });
    this.subjects.clear();
    this.backlogSubjects.clear();
    this.showBacklogUI = false;
    this.cdr.detectChanges();
  }
}