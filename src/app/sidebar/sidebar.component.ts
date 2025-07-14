import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';  // Import CommonModule
import { Router } from '@angular/router';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],  // Add CommonModule to imports
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() isOpen = false;
  @Output() toggle = new EventEmitter<void>();

  constructor(private router: Router, private modalService: ModalService) {}

  onToggle() {
    this.toggle.emit();
  }

  goHome() {
    this.router.navigate(['/']);
    this.onToggle();
  }

  openAddPropertyModal() {
    this.modalService.openAddPropertyModal();
    this.onToggle();
  }

  openModifyProperties() {
    this.router.navigate(['/modify-properties']);
    this.onToggle();
  }
}