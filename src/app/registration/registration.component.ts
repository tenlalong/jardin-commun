import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ModalService } from '../services/modal.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

// Custom validator for password requirements
function passwordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value as string;
  if (!value) return null;

  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

  const errors: ValidationErrors = {};
  if (!hasUpperCase) errors['noUpperCase'] = true;
  if (!hasLowerCase) errors['noLowerCase'] = true;
  if (!hasNumber) errors['noNumber'] = true;
  if (!hasSpecialChar) errors['noSpecialChar'] = true;

  return Object.keys(errors).length ? errors : null;
}

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  registrationForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      passwordValidator
    ])
  });

  registrationModalState$: Observable<boolean>;
  errorMessage: string | null = null;

  constructor(
    private modalService: ModalService,
    private http: HttpClient
  ) {
    this.registrationModalState$ = this.modalService.registrationModalState$;
  }

  openLoginModal() {
    this.modalService.openLoginModal();
  }

  closeModal() {
    this.modalService.closeRegistrationModal();
    this.registrationForm.reset();
    this.errorMessage = null;
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      this.http.post('http://localhost:5000/api/users/register', this.registrationForm.value).subscribe({
        next: (response: any) => {
          console.log('Registration successful', response);
          this.closeModal();
          this.openLoginModal();
        },
        error: (error) => {
          console.error('Registration failed', error);
          this.errorMessage = error.error.message || 'Registration failed. Please try again.';
        }
      });
    }
  }
}