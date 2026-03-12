import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormsModule } from '@angular/forms';
import { AddStudent } from '../../../../services/add-student';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-students.html',
  styleUrls: ['./add-students.css']
})
export class AddStudents {

  studentForm: FormGroup;
  showBacklogUI = false;   // 🔥 Needed for UI

  constructor(
    private fb: FormBuilder,
    private studentService: AddStudent
  ) {

    this.studentForm = this.fb.group({
      enrollmentNo: ['', [Validators.required, Validators.minLength(5)]],
      name: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      branch: ['', Validators.required],
      specialization: [''],
      semester: [1, [Validators.required, Validators.min(1), Validators.max(8)]],
      subjects: this.fb.array([]),
      hasBacklog: [false],
      backlogSubjects: this.fb.array([])
    });

    // 🔥 Proper backlog UI handling
    this.studentForm.get('hasBacklog')?.valueChanges.subscribe(value => {
      this.showBacklogUI = value;

      if (value) {
        if (this.backlogSubjects.length === 0) {
          this.addBacklogSubject();
        }
      } else {
        this.backlogSubjects.clear();
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

    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      return;
    }

    const formValue = this.studentForm.value;

    const payload = {
      ...formValue,
      subjects: this.subjects.value,
      backlogSubjects: formValue.hasBacklog
        ? this.backlogSubjects.value
        : null   
    };

    this.studentService.addStudent(payload).subscribe({
      next: (res) => {
        alert(res);
        this.studentForm.reset();
        this.subjects.clear();
        this.backlogSubjects.clear();
        this.showBacklogUI = false;
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }
}