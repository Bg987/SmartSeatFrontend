import { Component } from '@angular/core';
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

  responseMessage = '';
  loading = false;

  constructor(private collegeService: CollegeService) {}

 submitCollege(form?: any) {
  this.loading = true;

  this.collegeService.addCollege(this.collegeData).subscribe({
    next: (res: string) => {
      this.loading = false;
      alert(res);
         
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
    error: () => {
      this.loading = false;
      alert('Failed to add college');
    }
  });
}


}
