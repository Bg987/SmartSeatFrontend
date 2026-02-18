import { Component,ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddRoomsService } from '../../../../services/add-rooms-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'UploadRooms',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './upload-rooms.html',
  styleUrls: ['./upload-rooms.css']
})
export class UploadRooms {

  roomForm: FormGroup;
  csvFile: File | null = null;
  uploadMode: 'form' | 'csv' = 'form';
  message: string = '';
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private roomsService: AddRoomsService,
    private chengeDetector:ChangeDetectorRef
  ) {
    this.roomForm = this.fb.group({
      roomNumber: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      block: ['A', Validators.required],
    });
    this.message = "";
  }

  toggleMode(mode: 'form' | 'csv') {
    this.uploadMode = mode;
    this.message = '';
  }

  onFileChange(event: any) {
    const file = event.target.files[0];

    if (file && file.name.endsWith('.csv')) {
      this.csvFile = file;
      this.message = '';
    } else {
      this.csvFile = null;
      this.message = 'Please select a valid CSV file.';
    }
  }

  submitForm() {


    this.isSubmitting = true;

    this.roomsService.addRoom(this.roomForm.value).subscribe({
      next: (res) => {

        this.message = "room added succesfully";
        this.roomForm.markAsPristine();
        this.roomForm.markAsUntouched();
        this.isSubmitting = false;
        this.chengeDetector.detectChanges();
      },
      error: (err) => {
        this.message = err.error.message;
        this.isSubmitting = false;
        this.chengeDetector.detectChanges();
      }
    });
  }


  uploadCSV()
   { 
  if (!this.csvFile)
   { this.message = 'Please select a CSV file first.'; 
  
  return; 
  
  } 
  const formData = new FormData(); 
  
  formData.append('file', this.csvFile); 
  
  this.roomsService.uploadCSV(formData).subscribe({ 
  
  next: res => alert(res),
  
   error: err => alert(err.error)
   
   });
   
    }

}
