import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ModalService } from '../../services/modal.service';
import { SelectedPropertyService } from '../../services/selected-property.service';
import { PropertyService } from '../../services/property.service';
import { Subscription } from 'rxjs';
import { Property } from '../../types/property.model';
import { NgxImageCompressService } from 'ngx-image-compress';

interface Item {
  name: string;
  type: 'fruit' | 'vegetable';
}

@Component({
  selector: 'app-edit-property-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-property-modal.component.html',
  styleUrls: ['./edit-property-modal.component.css']
})
export class EditPropertyModalComponent implements OnInit, OnDestroy {
  editModalOpen = false;
  private subscription: Subscription = new Subscription();
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
  selectedProperty: Property | null = null;

  constructor(
    private modalService: ModalService,
    private selectedPropertyService: SelectedPropertyService,
    private http: HttpClient,
    private propertyService: PropertyService,
    private imageCompress: NgxImageCompressService
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.modalService.editPropertyModalState$.subscribe(state => {
        this.editModalOpen = state;
        if (state) {
          this.initializeForm();
        }
      })
    );
    this.subscription.add(
      this.propertyForm.get('search')?.valueChanges.subscribe(value => {
        this.filterItems(value || '');
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  initializeForm() {
    this.subscription.add(
      this.selectedPropertyService.selectedProperty$.subscribe(property => {
        this.selectedProperty = property;
        if (property) {
          this.propertyForm.patchValue({
            address: property.address,
            city: property.city,
            postalCode: property.postalCode
          });
          this.images = [...property.images];
          this.selectedItems = [
            ...property.fruits.map(name => ({ name, type: 'fruit' as 'fruit' })),
            ...property.vegetables.map(name => ({ name, type: 'vegetable' as 'vegetable' }))
          ];
        }
      })
    );
  }

  filterItems(search: string) {
    this.filteredItems = this.availableItems.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      !this.selectedItems.some(selected => selected.name === item.name)
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

  removeImage(index: number) {
    this.images.splice(index, 1);
  }

  closeModal() {
    this.modalService.closeEditPropertyModal();
    this.propertyForm.reset();
    this.images = [];
    this.selectedItems = [];
    this.filteredItems = [];
    this.errorMessage = null;
    this.selectedPropertyService.clearSelectedProperty();
  }

  onSubmit() {
    if (this.propertyForm.valid && this.selectedProperty) {
      const token = localStorage.getItem('token');
      if (!token) {
        this.errorMessage = 'You must be logged in to edit a property.';
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

      this.http.put(`http://localhost:5000/api/houses/${this.selectedProperty._id}`, payload, { headers }).subscribe({
        next: (response: any) => {
          console.log('Property updated successfully', response);
          this.propertyService.triggerRefresh();
          this.closeModal();
        },
        error: (error) => {
          console.error('Failed to update property', error);
          this.errorMessage = error.error.message || 'Failed to update property. Please try again.';
        }
      });
    }
  }
}