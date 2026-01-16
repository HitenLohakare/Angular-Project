import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { routes } from '../../shared/routes/routes';
import { AuthInfoService } from '../services/auth-info-service'; // Assumed service location
import { ApiResponse } from '../../shared/model/apiresponse';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-two-step-verification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './two-step-verification.component.html',
  styleUrl: './two-step-verification.component.scss'
})
export class TwoStepVerificationComponent implements OnInit {
  public routes = routes;
  verificationForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authInfoService: AuthInfoService,
    private toastr: ToastrService
  ) 
  
  {
    // Initialize form with 6 digits
    this.verificationForm = this.fb.group({
      otp: this.fb.array(
        new Array(6).fill('').map(() => ['', [Validators.required, Validators.pattern('^[0-9]$')]])
      )
    });
  }

  ngOnInit(): void {}

  get otpArray() {
    return this.verificationForm.get('otp') as FormArray;
  }

  @HostListener('window:paste', ['$event'])
  handleGlobalPaste(event: ClipboardEvent) {
    const pastedData = event.clipboardData?.getData('text').trim() || '';
    if (/^\d{6}$/.test(pastedData)) {
      event.preventDefault();
      const digits = pastedData.split('');
      digits.forEach((digit, i) => {
        if (i < 6) this.otpArray.at(i).setValue(digit);
      });
      document.getElementById('digit-6')?.focus();
    }
  }

  onInput(event: any, index: number) {
    if (event.target.value && index < 5) {
      document.getElementById(`digit-${index + 2}`)?.focus();
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace' && !this.otpArray.at(index).value && index > 0) {
      document.getElementById(`digit-${index}`)?.focus();
    }
  }

  verifyOTP() {
    if (this.verificationForm.invalid) return;

    this.isSubmitting = true;
    this.verificationForm.disable();

    const otpCode = this.otpArray.value.join('');
    const loginCipher = localStorage.getItem("login_cipher") || '';

    // Verify against API
    this.authInfoService.loginTwoFactor(otpCode, loginCipher).subscribe({
      next: (apiResponse: ApiResponse) => {
        if (apiResponse.success) {
          this.authInfoService.setToken(apiResponse.data.token);
          this.router.navigate([this.routes.index]);
        } else {
          this.resetForm(apiResponse.error?.message || 'Invalid OTP');
        }
      },
      error: () => {
        this.resetForm('Server error. Please try again later.');
      }
    }); 
  }

  private resetForm(message: string) {
    this.isSubmitting = false;
    this.verificationForm.enable();
    this.toastr.warning(message);
  }
}