import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SelectedPropertyService } from '../services/selected-property.service';
import { ModalService } from '../services/modal.service';
import { Property } from '../types/property.model';
import { EditPropertyModalComponent } from '../home/edit-property-modal/edit-property-modal.component';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-modify-properties',
  standalone: true,
  imports: [CommonModule, EditPropertyModalComponent, HeaderComponent, SidebarComponent],
  templateUrl: './modify-properties.component.html',
  styleUrls: ['./modify-properties.component.css']
})
export class ModifyPropertiesComponent implements OnInit {
  properties: Property[] = [];
  isSidebarOpen = false;

  constructor(
    private http: HttpClient,
    private selectedPropertyService: SelectedPropertyService,
    private modalService: ModalService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchProperties();
  }

  fetchProperties() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get('http://localhost:5000/api/houses', { headers }).subscribe({
      next: (response: any) => {
        this.properties = response.houses;
      },
      error: (error) => {
        console.error('Failed to fetch properties:', error);
      }
    });
  }

  editProperty(property: Property) {
    this.selectedPropertyService.setSelectedProperty(property);
    this.modalService.openEditPropertyModal();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  goBack() {
    this.router.navigate(['/']);
  }
}