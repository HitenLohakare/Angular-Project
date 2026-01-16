import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators} from '@angular/forms';  
import { AuthInfoService } from '../services/auth-info-service';
import { ApiResponse } from '../../shared/model/apiresponse';
import { ToastrService } from 'ngx-toastr';
import { routes } from '../../shared/routes/routes';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  
  routes = routes;
  loginForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private router: Router, 
    private formBuilder: FormBuilder,
    private authInfoService: AuthInfoService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      mobileNumber: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  public navigate() {
    this.router.navigate([routes.index]);
  }

  public password : boolean[] = [false];

  public togglePassword(index: any){
    this.password[index] = !this.password[index]
  }

  // 👇 Define a getter property (not a function call)
  get controls() {
    return this.loginForm.controls;
  }

  public onSubmit() {
    if (this.loginForm.valid) {
      this.isSubmitting = true;
      this.loginForm.disable();

      this.authInfoService.login(this.loginForm.value).subscribe({
        next: (apiResponse: ApiResponse) => {
          if (apiResponse.success) {

            const { cipher, is2FASetupRequired } = apiResponse.data;
            localStorage.setItem('login_cipher', cipher);
            if (is2FASetupRequired) {
              this.router.navigate([this.routes.twoStepSetupComponent]);
            } else {
              this.router.navigate([this.routes.twoStepVerfication]); 
            }
          } else {
            this.isSubmitting = false;
            this.loginForm.enable();
            this.toastr.warning(apiResponse.error?.message);
          }
        },
        error: () => {
          this.isSubmitting = false;
          this.loginForm.enable();
          this.toastr.error('Server error occurred. Please contact support.');
         }
      }); 
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}