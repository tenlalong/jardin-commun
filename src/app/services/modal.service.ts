import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private registrationModalState = new BehaviorSubject<boolean>(false);
  private loginModalState = new BehaviorSubject<boolean>(false);
  private addPropertyModalState = new BehaviorSubject<boolean>(false);
  private editPropertyModalState = new BehaviorSubject<boolean>(false);

  registrationModalState$ = this.registrationModalState.asObservable();
  loginModalState$ = this.loginModalState.asObservable();
  addPropertyModalState$ = this.addPropertyModalState.asObservable();
  editPropertyModalState$ = this.editPropertyModalState.asObservable();

  openRegistrationModal() {
    this.closeAllModals();
    this.registrationModalState.next(true);
  }

  openLoginModal() {
    this.closeAllModals();
    this.loginModalState.next(true);
  }

  openAddPropertyModal() {
    this.closeAllModals();
    this.addPropertyModalState.next(true);
  }

  openEditPropertyModal() {
    this.closeAllModals();
    this.editPropertyModalState.next(true);
  }

  closeRegistrationModal() {
    this.registrationModalState.next(false);
  }

  closeLoginModal() {
    this.loginModalState.next(false);
  }

  closeAddPropertyModal() {
    this.addPropertyModalState.next(false);
  }

  closeEditPropertyModal() {
    this.editPropertyModalState.next(false);
  }

  private closeAllModals() {
    this.registrationModalState.next(false);
    this.loginModalState.next(false);
    this.addPropertyModalState.next(false);
    this.editPropertyModalState.next(false);
  }
}