import { Component } from '@angular/core';
import { routes } from '../../shared/routes/routes';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RecaptchaModule } from 'ng-recaptcha-2';
import { RecaptchaFormsModule } from 'ng-recaptcha-2';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, RecaptchaModule, RecaptchaFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  public routes = routes
  constructor(private router: Router) {}

  public navigate() {
    this.router.navigate([routes.emailVerification]);
  }
  
  mobile: string = '';
  recaptchaToken: string | null = null;

  onCaptchaResolved(token: string | null) {
    this.recaptchaToken = token;
    console.log('CAPTCHA resolved:', token);
  }

  onSubmit() {
    if (!this.mobile) {
      alert('Please enter your mobile number.');
      return;
    }

    if (!this.recaptchaToken) {
      alert('Please complete the reCAPTCHA.');
      return;
    }

    // Proceed with submitting mobile and token
    console.log('Submitting:', { mobile: this.mobile, recaptchaToken: this.recaptchaToken });

    // Optionally reset token
    this.recaptchaToken = null;
  }
}
