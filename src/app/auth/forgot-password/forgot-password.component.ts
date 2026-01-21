import { Component, OnInit } from '@angular/core';
import { routes } from '../../shared/routes/routes';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthInfoService } from '../services/auth-info-service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent implements OnInit {
  public routes = routes;
  forgotPasswordForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authInfoService: AuthInfoService
  ) {}


  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      // Validates that it contains at least 10 digits, allowing spaces, plus signs, and dashes
      mobile: ['', [
        Validators.required, 
        Validators.pattern('^[+]*[0-9\\s\\-]+$'),
        Validators.minLength(10)
      ]]
    });
  }

  // Getter for easy access to form fields in HTML
  get controls() {
    return this.forgotPasswordForm.controls;
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.isSubmitting = true;
      this.forgotPasswordForm.disable(); // Prevent multiple submissions

      const mobileNumber = this.forgotPasswordForm.value.mobile;
      console.log('Requesting reset for:', mobileNumber);

      // Calling the service and subscribing to the result
      this.authInfoService.forgetPassword(mobileNumber).subscribe({
        next: (apiResponse: any) => { // Use your ApiResponse model here
          if (apiResponse.success) {
            this.isSubmitting = false;
            this.toastr.success('If the mobile number is registered, you’ll receive an SMS with a password reset link.'); 
          } else {
            this.forgotPasswordForm.enable();
            this.toastr.warning(apiResponse.error?.message || 'Something went wrong.');
          }
        },
        error: () => {
          this.isSubmitting = false;
          this.forgotPasswordForm.enable();
          this.toastr.error('Server error occurred. Please contact support.');
        }
      });
    } else {
      this.forgotPasswordForm.markAllAsTouched();
    }
  }
  
}