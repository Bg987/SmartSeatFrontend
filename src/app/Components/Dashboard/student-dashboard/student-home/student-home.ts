import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-home.html',
  styleUrl: './student-home.css'
})
export class StudentHome implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  url: string = environment.apiUrl;
  student: any;
  college: any;
  
  // State Management
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isUploading: boolean = false;
  isDarkMode: boolean = false;

  constructor(
    private http: HttpClient, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTheme();
    this.loadStudentDetails();
  }

  /**
   * Fetches initial student and college data
   */
  loadStudentDetails() {
    this.http.get<any>(`${this.url}/student/getStudentDetails`, { withCredentials: true })
      .subscribe({
        next: (res) => {
          this.student = res.student;
          this.college = res.college;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error fetching details', err)
      });
  }

  /**
   * Handles file selection and generates a local preview
   */
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    
    if (file) {
      // Validation: Backend strictly requires JPG/JPEG
      if (file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
        alert("Only JPG/JPEG images are allowed.");
        this.resetSelection();
        return;
      }

      this.selectedFile = file;

      // Generate local preview URL
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  /**
   * Uploads the image to the server
   */
  confirmAndUpload(): void {
    if (!this.selectedFile) return;

    this.isUploading = true;
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    // Endpoint handles ROLE_student authentication internally
    this.http.post(`${this.url}/student/addStudentImage`, formData, {
      withCredentials: true,
      responseType: 'text' // Backend returns String messages
    }).subscribe({
      next: (res) => {
        alert("Success: Your identity has been verified and locked.");
        this.resetSelection();
        this.loadStudentDetails(); // Reload to show the locked Cloudinary image
      },
      error: (err: HttpErrorResponse) => {
        this.isUploading = false;
        // Display backend error messages (e.g., "Already uploaded")
        const msg = err.error || "Upload failed. Please try again.";
        alert(msg);
        this.resetSelection();
      }
    });
  }

  resetSelection(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    this.cdr.detectChanges();
  }

  // --- Theme Logic ---
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  private loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
  }
}