import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../services/modal.service';
import { AddPropertyModalComponent } from './add-property-modal/add-property-modal.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PropertyService } from '../services/property.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

interface Property {
  _id: string;
  address: string;
  city: string;
  postalCode: string;
  fruits: string[];
  vegetables: string[];
  images: string[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, AddPropertyModalComponent, HeaderComponent, SidebarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  userFirstName: string = localStorage.getItem('userFirstName') || 'Guest';
  isSidebarOpen = false;
  properties: Property[] = [];
  allProperties: Property[] = [];
  private subscription: Subscription = new Subscription();

  @ViewChild('allPropertiesGrid', { static: false }) allPropertiesGrid!: ElementRef;
  @ViewChild('myPropertiesGrid', { static: false }) myPropertiesGrid!: ElementRef;

  constructor(
    private modalService: ModalService,
    private http: HttpClient,
    private propertyService: PropertyService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchProperties();
    this.fetchAllProperties();
    this.subscription.add(
      this.propertyService.refreshProperties$.subscribe(() => {
        console.log('Refreshing properties');
        this.fetchProperties();
        this.fetchAllProperties();
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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
        console.log('User properties response:', response);
        this.properties = response.houses.map((house: any) => ({
          _id: house._id,
          address: house.address,
          city: house.city,
          postalCode: house.postalCode,
          fruits: house.fruits,
          vegetables: house.vegetables,
          images: house.images
        }));
      },
      error: (error) => {
        console.error('Failed to fetch user properties:', error.status, error.error);
      }
    });
  }

  fetchAllProperties() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.http.get('http://localhost:5000/api/houses/all', { headers }).subscribe({
      next: (response: any) => {
        console.log('All properties response:', response);
        if (response.houses) {
          this.allProperties = response.houses.map((house: any) => ({
            _id: house._id,
            address: house.address,
            city: house.city,
            postalCode: house.postalCode,
            fruits: house.fruits,
            vegetables: house.vegetables,
            images: house.images
          }));
        } else {
          console.warn('No houses in response:', response);
          this.allProperties = [];
        }
      },
      error: (error) => {
        console.error('Failed to fetch all properties:', error.status, error.error);
        this.allProperties = [];
      }
    });
  }

  scrollLeft(section: 'all' | 'my') {
    const grid = section === 'all' ? this.allPropertiesGrid.nativeElement : this.myPropertiesGrid.nativeElement;
    const cardWidth = 344; // 320px card + 24px gap
    const scrollLeft = grid.scrollLeft;
    const maxScroll = grid.scrollWidth - grid.clientWidth;

    if (scrollLeft <= 0) {
      grid.scrollTo({ left: maxScroll, behavior: 'smooth' });
    } else {
      grid.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    }
  }

  scrollRight(section: 'all' | 'my') {
    const grid = section === 'all' ? this.allPropertiesGrid.nativeElement : this.myPropertiesGrid.nativeElement;
    const cardWidth = 344; // 320px card + 24px gap
    const scrollLeft = grid.scrollLeft;
    const maxScroll = grid.scrollWidth - grid.clientWidth;

    if (scrollLeft >= maxScroll) {
      grid.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      grid.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  openAddPropertyModal() {
    this.modalService.openAddPropertyModal();
    this.isSidebarOpen = false;
  }

  openModifyProperties() {
    this.router.navigate(['/modify-properties']);
    this.isSidebarOpen = false;
  }
}