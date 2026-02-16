import { Component,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CollegeService } from '../../services/add-colleges';

@Component({
  selector: 'app-add-college',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-colleges-component.html',
  styleUrls: ['./add-colleges-component.css']
})
export class AddCollegeComponent {

  collegeData = {
    collegeName: '',
    email: '',
    contactNumber: '',
    address: ''
  };

  response: String = '';
  loading = false;

  constructor(private collegeService: CollegeService,private cdr: ChangeDetectorRef) {}

 submitCollege(form?: any) {
  this.loading = true;

  this.collegeService.addCollege(this.collegeData).subscribe({
    next: (res: String) => {
      this.loading = false;
      this.response =res;
         
      this.collegeData = {
        collegeName: '',
        email: '',
        contactNumber: '',
        address: ''
      };

      if (form) {
        form.resetForm();   // force UI refresh
      }
    },
    error: (error) => {
      this.loading = false;
      console.log(JSON.stringify(error));
      this.response = error.error;
      this.cdr.detectChanges();
    }
  });
  }
  
}
