import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormsModule } from '@angular/forms';
import { AddStudent } from '../../../../services/add-student';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-form',
   standalone:true,
    imports: [CommonModule, FormsModule,ReactiveFormsModule],
   templateUrl: './add-students.html',
  styleUrls: ['./add-students.css']
})
export class AddStudents {
  studentForm: FormGroup;

  constructor(private fb: FormBuilder, private studentService: AddStudent) {
    this.studentForm = this.fb.group({
      enrollmentNo: ['', [Validators.required, Validators.minLength(5)]],
      name: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      branch: ['', Validators.required],
      specialization: [''],
      semester: [1, [Validators.required, Validators.min(1), Validators.max(8)]],
      subjects: this.fb.array([]), // Start with empty list
      hasBacklog: [false],
      imgUrl: [''],
      collegeId: [null, Validators.required]
    });
  }

  get subjects() {
    return this.studentForm.get('subjects') as FormArray;
  }

  addSubject() {
    this.subjects.push(this.fb.control('', Validators.required));
  }

  removeSubject(index: number) {
    this.subjects.removeAt(index);
  }

  onSubmit() {
    if (this.studentForm.valid) {
      this.studentService.addStudent(this.studentForm.value).subscribe({
        next: (res) => alert(res),
        error: (err) => console.error('Error:', err)
      });
    }
  }
}