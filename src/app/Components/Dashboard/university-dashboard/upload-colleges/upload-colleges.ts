import { Component, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'app-upload-csv',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-colleges.html',
  styleUrls: ['./upload-colleges.css']
})
export class UploadCsvComponent {
  private url = environment.apiUrl;
  selectedFile: File | null = null;
  fileSize: string = '';
  isDragging = false;
  isUploading = false;
  responseMessage: string = '';
  isError = false;

  private uploadUrl = `${this.url}/university/addColleges`;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef  
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file && file.name.toLowerCase().endsWith('.csv')) {
      this.selectedFile = file;
      this.fileSize = (file.size / 1024).toFixed(2) + ' KB';
      this.responseMessage = '';
    } else {
      alert("Please upload a valid CSV file");
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;

    if (event.dataTransfer?.files.length) {
      const file = event.dataTransfer.files[0];

      if (file.name.toLowerCase().endsWith('.csv')) {
        this.selectedFile = file;
        this.fileSize = (file.size / 1024).toFixed(2) + ' KB';
        this.responseMessage = '';
      } else {
        alert("Only CSV files are allowed");
      }
    }
  }

 uploadFile() {

  if (!this.selectedFile || this.isUploading) {
    console.log("Upload prevented - either no file or already uploading");
    return;
  }

  const formData = new FormData();
  formData.append("file", this.selectedFile);

  this.isUploading = true;
  this.isError = false;

  this.http.post<string[]>(this.uploadUrl, formData,{withCredentials: true})
    .pipe(
      finalize(() => {
        this.isUploading = false;
        this.cdr.detectChanges();
      })
    )
    .subscribe({

      next: (response: any) => {

        let message = '';

        if (Array.isArray(response)) {
          message = response.join('\n');
        } else if (typeof response === 'string') {
          message = response;
        } else {
          message = JSON.stringify(response);
        }

        alert("Upload Result:\n\n" + message);   // 🔥 ALERT HERE
      },

      error: (error: HttpErrorResponse) => {

        let message = '';

        if (Array.isArray(error.error)) {
          message = error.error.join('\n');
        } else if (typeof error.error === 'string') {
          message = error.error;
        } else {
          message = "Upload failed!";
        }

        alert("Error:\n\n" + message);   // 🔥 ERROR ALERT
      }
    });
}

}





