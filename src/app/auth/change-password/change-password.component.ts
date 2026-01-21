import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, AbstractControlOptions } from '@angular/forms';
import { AuthInfoService } from '../services/auth-info-service';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from '../../shared/model/apiresponse';
import { Router } from '@angular/router';
import { routes } from '../../shared/routes/routes';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  passwordForm!: FormGroup;
  
  showOldPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  routes = routes;

  constructor(
    private fb: FormBuilder,
    private authInfoService: AuthInfoService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.passwordForm = this.fb.group({
      // All fields are now marked as required
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { 
      validators: [this.passwordMatchValidator]
    } as AbstractControlOptions);
  }

  passwordMatchValidator(form: FormGroup) {
    const newPass = form.get('newPassword')?.value;
    const confirmPass = form.get('confirmPassword')?.value;
    // Returns mismatch error if passwords don't match
    return newPass === confirmPass ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      console.log('Form Data:', this.passwordForm.value);
      this.authInfoService.changePassword(this.passwordForm.value).subscribe({
        next: (apiResponse: ApiResponse) => {
          if (apiResponse.success) {
            this.toastr.success('Password changed successfully');
            this.authInfoService.logOut();
            this.router.navigate([routes.login])
          } else {
            this.toastr.warning(apiResponse.error?.message);
            this.passwordForm.enable();
          }
        },
        error: () => {
          this.toastr.error('Server error occurred. Please contact support.');
        }
      });
    } else {
      // Mark all as touched to show errors if user tries to submit while empty
      this.passwordForm.markAllAsTouched();
    }
  }
}