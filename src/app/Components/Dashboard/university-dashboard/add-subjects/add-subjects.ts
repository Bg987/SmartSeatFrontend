import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddSubjectService } from '../../../../services/add-subject-service';

@Component({
  selector: 'app-add-subject',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule   // ✅ ye important hai
  ],
  templateUrl: './add-subjects.html',
  styleUrls: ['./add-subjects.css']
})
export class AddSubjects {

  subjectForm: FormGroup;
  responseMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private subjectService: AddSubjectService
  ) {
    this.subjectForm = this.fb.group({
      subjectId: ['', Validators.required],
      subjectName: ['', Validators.required]
    });
  }

  onSubmit() {

    if (this.subjectForm.invalid) {
      return;
    }

    this.subjectService.addSubject(this.subjectForm.value)
      .subscribe({
        next: (res: any) => {
          console.log("Backend Response:", res);
          this.responseMessage = res.message || 'Subject added successfully';
          this.subjectForm.reset();
        },
        error: (err) => {
          console.error("Error:", err);
          this.responseMessage = 'Failed to add subject';
        }
      });
  }
}
