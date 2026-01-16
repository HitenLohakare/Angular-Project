import { Component, OnInit, HostListener } from '@angular/core'; // Add HostListener
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QRCodeComponent } from 'angularx-qrcode';
import { Clipboard } from '@angular/cdk/clipboard';
import { AuthInfoService } from '../services/auth-info-service';
import { ApiResponse } from '../../shared/model/apiresponse';
import { routes } from '../../shared/routes/routes';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-two-step-setup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, QRCodeComponent],
  templateUrl: './two-step-setup.component.html'
})
export class TwoStepSetupComponent implements OnInit {
  setupForm: FormGroup;
  qrData: string = '';
  secretKey: string = '';
  isSubmitting = false;
  routes = routes

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private clipboard: Clipboard,
    private authInfoService: AuthInfoService,
    private toastr: ToastrService
  ) {
    this.setupForm = this.fb.group({
      otp: this.fb.array(
        new Array(6).fill('').map(() => ['', [Validators.required, Validators.pattern('^[0-9]$')]])
      )
    });
  }

  get otpArray() {
    return this.setupForm.get('otp') as FormArray;
  }

  ngOnInit(): void {
    // Logic for generating keys
    this.secretKey = this.generateSecretKey(16);
    this.qrData = `otpauth://totp/Provilac:User?secret=${this.secretKey}&issuer=Provilac`;
  }

  /**
   * GLOBAL PASTE LISTENER
   * This captures the paste event even if no input is focused.
   */
  @HostListener('window:paste', ['$event'])
  handleGlobalPaste(event: ClipboardEvent) {
    const pastedData = event.clipboardData?.getData('text').trim() || '';

    // Check if the pasted string is exactly 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      event.preventDefault(); // Prevent default if it's a valid OTP
      const digits = pastedData.split('');
      
      digits.forEach((digit, i) => {
        if (i < 6) {
          this.otpArray.at(i).setValue(digit);
        }
      });

      // Focus the last input box to show the user it's done
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

  verifyAndEnable() {
    
    if (this.setupForm.invalid) return;
    this.setupForm.disable();
    this.isSubmitting = true;
    
   
    this.authInfoService.verifyTwoFactor(this.secretKey, this.otpArray.value.join(''), localStorage.getItem("login_cipher")).subscribe({
      next: (apiResponse: ApiResponse) => {
        if(apiResponse.success) {
          this.authInfoService.setToken(apiResponse.data.token);
          this.router.navigate([this.routes.index])
        } else {
          this.isSubmitting = false;
          this.setupForm.enable();
          this.toastr.warning(apiResponse.error?.message);
        }
      },
      error: () => {
        this.isSubmitting = false;
        this.setupForm.enable();
        this.toastr.warning('Server error occurred. Please contact support.');
      }
    });

  }

  generateSecretKey(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let result = '';
    for (let i = 0; i < length; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    return result;
  }

  copySecretKey() {
    this.clipboard.copy(this.secretKey);
    this.toastr.success('secret key copied');
  }
}