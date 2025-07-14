import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';  // Import CommonModule

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],  // Add CommonModule to imports
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  userFirstName: string = localStorage.getItem('userFirstName') || 'Guest';
  @Input() isSidebarOpen: boolean = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }
}