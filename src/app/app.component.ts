import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { ModalService } from './services/modal.service';
import { Router } from '@angular/router';
import { LoginScreenComponent } from './login-screen/login-screen.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RegistrationComponent,
    LoginComponent,
    LoginScreenComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Jardin Commun';

  constructor(private modalService: ModalService, private router: Router) {}

  // Public getter to expose current URL
  get currentUrl(): string {
    return this.router.url;
  }

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