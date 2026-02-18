import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddRoomsService } from '../../../../services/add-rooms-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'UploadRooms',
  standalone:true,
  imports:[ReactiveFormsModule,CommonModule],
  templateUrl: './upload-rooms.html',
  styleUrls: ['./upload-rooms.css']
})
export class UploadRooms {
  roomForm: FormGroup;
  csvFile: File | null = null;
  uploadMode: 'form' | 'csv' = 'form';
  message: string = '';

  constructor(private fb: FormBuilder, private roomsService: AddRoomsService) {
    this.roomForm = this.fb.group({
      roomNumber: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      block: ['', Validators.required],
      college_id: ['', Validators.required]
    });
  }

  toggleMode(mode: 'form' | 'csv') {
    this.uploadMode = mode;
    this.message = '';
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      this.csvFile = file;
    } else {
      this.message = 'Please select a valid CSV file.';
    }
  }

  submitForm() {
    if (this.roomForm.valid) {
      this.roomsService.addRoom(this.roomForm.value).subscribe({
        
        next: res => alert("Successfully added---"),
        error: err => alert("Fail to add...")
      });

      
     
    }
  }

  // uploadCSV() {
  //   if (!this.csvFile) {
  //     this.message = 'Please select a CSV file first.';
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append('file', this.csvFile);

  //   this.roomsService.uploadCSV(formData).subscribe({
  //     next: res => this.message = 'CSV uploaded successfully!',
  //     error: err => this.message = 'Error uploading CSV!'
  //   });
  // }
}
