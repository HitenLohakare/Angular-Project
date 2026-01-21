import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthInfoService } from '../services/auth-info-service';
import { ApiResponse } from '../../shared/model/apiresponse';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss'
})
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  isSubmitting = false;
  showNewPassword = false;
  showConfirmPassword = false;
  token: string = ''; 
  
  constructor(
    private fb: FormBuilder,
    private authInfoService: AuthInfoService,
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    this.activatedRoute.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  // Getter for easy access to form fields
  get controls() {
    return this.resetForm.controls;
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');
    return password && confirmPassword && password.value !== confirmPassword.value 
      ? { passwordMismatch: true } : null;
  }

  onSubmit() {
    if (this.resetForm.valid) {
      this.isSubmitting = true;
      this.resetForm.disable();

      console.log("token", this.token)
      // Assuming your service has a resetPassword method
      this.authInfoService.resetPassword(this.resetForm.value, this.token).subscribe({
        next: (res: ApiResponse) => {
          if (res.success) {
            this.toastr.success('Password reset successfully!');
            this.router.navigate(['/login']);
          } else {
            this.handleError(res.error?.message || 'Password reset failed.');
          }
        },
        error: () => this.handleError('An error occurred. Please try again.')
      });
    } else {
      this.resetForm.markAllAsTouched();
    }
  }

  private handleError(message: string) {
    this.isSubmitting = false;
    this.resetForm.enable();
    this.toastr.error(message || 'Request failed');
  }
}