import { Component } from '@angular/core';
import { routes } from '../../shared/routes/routes';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators} from '@angular/forms';  

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink], // ✅ only NgModules/directives/components allowed here
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  
  routes = routes;
  loginForm!: FormGroup;

  constructor(
    private router: Router, 
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      userName: ['', [Validators.required]],
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
      this.loginForm.disable(); // Disable the form to prevent multiple submissions
      console.log('Form Submitted!', this.loginForm.value);
      
    } else {
      console.log('Form is invalid');
      this.loginForm.markAllAsTouched();
    }
  }
}
