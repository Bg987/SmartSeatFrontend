import { Component,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'app-update-student-image',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-student-image.html',
  styleUrl: './update-student-image.css',
})
export class UpdateStudentImage {
  private url = environment.apiUrl;
  enrollmentNo: string = '';
  selectedFile: File | null = null;
  isLoading: boolean = false;
  message: string = '';
  isError: boolean = false;

  constructor(private http: HttpClient,  private cdr: ChangeDetectorRef ) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    if (!this.selectedFile || !this.enrollmentNo) {
      this.message = 'Please provide both enrollment number and an image.';
      this.isError = true;
      return;
    }

    this.isLoading = true;
    this.message = '';
    
    const formData = new FormData();
    formData.append('file', this.selectedFile);
  
    // Dynamic URL matching your @PostMapping("/{enrollmentNo}/addStudentImage")
    const url = `${this.url}/student/${this.enrollmentNo}/addStudentImage`;

    this.http.post(url,
      formData,
      { withCredentials: true, responseType: 'text' })
      .subscribe({
        next: (response) => {
        console.log(response);
        this.isLoading = false;
        this.message = response;
          this.isError = false;
          this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
        this.isError = true;
        this.message = err.error || 'Failed to upload image.';
        this.cdr.detectChanges();
      }
    });
  }
}