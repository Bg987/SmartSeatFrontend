import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'app-upload-students',
  imports: [CommonModule],
  templateUrl: './upload-students.html',
    styleUrls: ['./upload-students.css'],
})
export class UploadStudents {


  selectedFile: File | null = null;
  fileSize: string = '';
  isDragging = false;
  isUploading = false;
  responseMessage: string = '';
  isError = false;

  private url = environment.apiUrl;
  private uploadUrl = `${this.url}/colleges/uploadStudents`;
  //Not present yet only template is ready---

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef   // Injected
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.responseMessage = '';
    if (file && file.name.toLowerCase().endsWith('.csv')) {
      this.selectedFile = file;
      this.fileSize = (file.size / 1024).toFixed(2) + ' KB';
      this.responseMessage = '';
    } else {
      alert("Please upload a valid CSV file");
    }
    this.cdr.detectChanges();
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

   this.responseMessage = "";
  if (!this.selectedFile || this.isUploading) {
    console.log("Upload prevented - either no file or already uploading");
    return;
  }

  const formData = new FormData();
  formData.append("file", this.selectedFile);

  this.isUploading = true;
  this.isError = false;

  this.http.post<string[]>(
    this.uploadUrl,
    formData,
    {
      withCredentials: true  
    }
  )
  .pipe(
    finalize(() => {
      this.isUploading = false;
      this.cdr.detectChanges();
    })
  )
  .subscribe({

    next: (response: any) => {
      //alert(JSON.stringify(response));
      if (Array.isArray(response)) {
        this.responseMessage  = response.join('\n');
      } else if (typeof response === 'string') {
        this.responseMessage = response;
      } else {
        this.responseMessage = JSON.stringify(response);
      }
      this.cdr.detectChanges();
      //alert("Upload Result:\n\n" + message);
    },

    error: (error: HttpErrorResponse) => {

      if (Array.isArray(error.error)) {
       this.responseMessage = error.error.join('\n');
      } else if (typeof error.error === 'string') {
        this.responseMessage = error.error;
      } else {
        this.responseMessage = "Upload failed!";
      }
      this.cdr.detectChanges();
    }
  });
}
}
