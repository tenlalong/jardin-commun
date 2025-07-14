import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalService } from '../../services/modal.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgxImageCompressService } from 'ngx-image-compress';
import { PropertyService } from '../../services/property.service'; // Added import

interface Item {
  name: string;
  type: 'fruit' | 'vegetable';
}

@Component({
  selector: 'app-add-property-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-property-modal.component.html',
  styleUrls: ['./add-property-modal.component.css']
})
export class AddPropertyModalComponent implements OnInit {
  addPropertyModalState$: Observable<boolean>;
  propertyForm = new FormGroup({
    address: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    postalCode: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/)]),
    search: new FormControl('')
  });
  images: string[] = [];
  selectedItems: Item[] = [];
  availableItems: Item[] = [
    { name: 'Apples', type: 'fruit' },
    { name: 'Strawberries', type: 'fruit' },
    { name: 'Blueberries', type: 'fruit' },
    { name: 'Carrots', type: 'vegetable' },
    { name: 'Lettuce', type: 'vegetable' },
    { name: 'Tomatoes', type: 'vegetable' },
    { name: 'Cucumbers', type: 'vegetable' },
    { name: 'Zucchini', type: 'vegetable' },
    { name: 'Peppers', type: 'vegetable' }
  ];
  filteredItems: Item[] = [];
  errorMessage: string | null = null;

  constructor(
    private modalService: ModalService,
    private router: Router,
    private http: HttpClient,
    private imageCompress: NgxImageCompressService,
    private propertyService: PropertyService // Added PropertyService injection
  ) {
    this.addPropertyModalState$ = this.modalService.addPropertyModalState$;
  }

  ngOnInit() {
    this.propertyForm.get('search')?.valueChanges.subscribe(value => {
      this.filterItems(value || '');
    });
  }

  filterItems(search: string) {
    this.filteredItems = this.availableItems.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  selectItem(item: Item) {
    if (!this.selectedItems.find(i => i.name === item.name)) {
      this.selectedItems.push(item);
    }
    this.propertyForm.get('search')?.setValue('');
    this.filteredItems = [];
  }

  removeItem(item: Item) {
    this.selectedItems = this.selectedItems.filter(i => i.name !== item.name);
  }

  async onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      for (const file of Array.from(input.files)) {
        try {
          // Convert the File to a base64 string
          const base64Image = await this.fileToBase64(file);
          // Compress the base64 image
          const compressedImage = await this.imageCompress.compressFile(base64Image, -1, 100, 80, 800, 800);
          this.images.push(compressedImage);
        } catch (error) {
          console.error('Failed to compress image:', error);
          this.errorMessage = 'Failed to compress image. Please try again.';
        }
      }
    }
  }

  // Helper method to convert File to base64 string
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }

  closeModal() {
    this.modalService.closeAddPropertyModal();
    this.propertyForm.reset();
    this.images = [];
    this.selectedItems = [];
    this.filteredItems = [];
    this.errorMessage = null;
    this.router.navigate(['/home']);
  }

  onSubmit() {
    if (this.propertyForm.valid) {
      const token = localStorage.getItem('token');
      if (!token) {
        this.errorMessage = 'You must be logged in to add a property.';
        return;
      }

      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });

      const payload = {
        address: this.propertyForm.value.address,
        city: this.propertyForm.value.city,
        postalCode: this.propertyForm.value.postalCode,
        images: this.images,
        fruits: this.selectedItems.filter(i => i.type === 'fruit').map(i => i.name),
        vegetables: this.selectedItems.filter(i => i.type === 'vegetable').map(i => i.name)
      };

      this.http.post('http://localhost:5000/api/houses', payload, { headers }).subscribe({
        next: (response: any) => {
          console.log('House added successfully', response);
          this.propertyService.triggerRefresh(); // Added to trigger auto-refresh
          this.closeModal();
        },
        error: (error) => {
          console.error('Failed to add house', error);
          this.errorMessage = error.error.message || 'Failed to add property. Please try again.';
        }
      });
    }
  }
}