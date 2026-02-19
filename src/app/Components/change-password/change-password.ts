import { Component,ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // <--- Add this 

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './change-password.html',
  styleUrls: ['./change-password.css']
})
  
export class changePassword {
  showOld: boolean = false;
  showNew: boolean = false;
  showConfirm: boolean = false;
  passwordForm: FormGroup;
  responseMessage: string = '';
  isError: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService,  private cd: ChangeDetectorRef) {
    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      // Mapping the data to match your PasswordDTO (oldPassword, newPassword)
      const data = {
        oldPassword: this.passwordForm.value.oldPassword,
        newPassword: this.passwordForm.value.newPassword
      };

      this.authService.passwordchange(data).subscribe({
        next: (response) => {
          console.log(response);
          this.responseMessage = "Password updated successfully!";
          this.isError = false;
          this.cd.detectChanges();
          this.passwordForm.reset();
        },
        error: (err) => {
          console.error(err);
          console.log(err);
          // With responseType: 'text', the error might be in err.error
          this.responseMessage = "Update failed. Please check your old password.";
          this.isError = true;
          this.cd.detectChanges();
        }
      });
    }
  }
}