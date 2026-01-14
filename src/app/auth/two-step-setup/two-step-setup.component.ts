import { Component } from '@angular/core';
import { routes } from '../../shared/routes/routes';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QRCodeComponent } from 'angularx-qrcode';
import { Clipboard } from '@angular/cdk/clipboard'; // Angular CDK clipboard
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-two-step-setup.component',
  imports: [CommonModule, FormsModule, QRCodeComponent],
  templateUrl: './two-step-setup.component.html',
  styleUrl: './two-step-setup.component.scss'
})
export class TwoStepSetupComponent {

  routes = routes;
  constructor(
    private router: Router,
    private clipboard: Clipboard 
  ) {}

  navigation() {
    this.router.navigate([routes.twoStepVerfication])
  }

  qrData: string = '';      // dynamic string for QR
  secretKey: string = '';   // secret for Google Authenticator

  ngOnInit(): void {
    // Example: dynamically generate a secret or fetch from backend
    this.secretKey = this.generateSecretKey(16);

    // Google Authenticator–compatible otpauth URL
    const issuer = 'Provilac';
    const accountName = 'riturajpatel';
    this.qrData = `otpauth://totp/${issuer}:${accountName}?secret=${this.secretKey}&issuer=${issuer}`;

    // Global paste listener
    document.addEventListener('paste', this.globalPasteHandler);
  }

  ngOnDestroy(): void {
    document.removeEventListener('paste', this.globalPasteHandler);
  }

  globalPasteHandler = (event: ClipboardEvent): void => {
    var clipboardData = event.clipboardData || (window as any).clipboardData;
    var pastedText = clipboardData.getData('text').trim();

    // Only proceed if it's exactly 6 digits
    if (/^\d{6}$/.test(pastedText)) {
      for (let i = 0; i < 6; i++) {
        const input = document.getElementById(`digit-${i + 1}`) as HTMLInputElement;
        if (input) {
          input.value = pastedText[i];
        }
      }
      // Focus the last input
      const lastInput = document.getElementById('digit-6') as HTMLInputElement;
      lastInput?.focus();
    }
  };

  generateSecretKey(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'; // Base32 chars
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  copied = false;
  copySecretKey() {

    this.clipboard.copy(this.secretKey);
    this.copied = true;

    navigator.clipboard.writeText(this.secretKey).then(() => {
      this.copied = true;
    }).catch(err => {
      console.error('Failed to copy:', err);
      alert('Failed to copy the secret key.');
    });
  }
}
