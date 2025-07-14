import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationComponent } from '../registration/registration.component';
import { LoginComponent } from '../login/login.component';
import { ModalService } from '../services/modal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-screen',
  standalone: true,
  imports: [CommonModule, RegistrationComponent, LoginComponent],
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.css']
})
export class LoginScreenComponent {
  title = 'Jardin Commun';

  constructor(private modalService: ModalService, private router: Router) {}

  openRegistrationModal() {
    this.modalService.openRegistrationModal();
  }

  openLoginModal() {
    this.modalService.openLoginModal();
  }

  simulateLogin() {
    this.router.navigate(['/home']);
  }
}
