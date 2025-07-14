import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalService } from '../services/modal.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  loginModalState$: Observable<boolean>;
  errorMessage: string | null = null;

  constructor(
    private modalService: ModalService,
    private router: Router,
    private http: HttpClient
  ) {
    this.loginModalState$ = this.modalService.loginModalState$;
  }

  openRegistrationModal() {
    this.modalService.openRegistrationModal();
  }

  closeModal() {
    this.modalService.closeLoginModal();
    this.loginForm.reset();
    this.errorMessage = null;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.http.post('http://localhost:5000/api/users/login', { email, password }).subscribe({
        next: (response: any) => {
          console.log('Login successful', response);
          localStorage.setItem('token', response.token); // Store JWT
          localStorage.setItem('userFirstName', response.user.firstName); // Store first name
          this.router.navigate(['/home']);
          this.closeModal();
        },
        error: (error) => {
          console.error('Login failed', error);
          this.errorMessage = error.error.message || 'Login failed. Please try again.';
        }
      });
    }
  }
}