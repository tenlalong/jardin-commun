import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Property } from '../types/property.model';

@Injectable({
  providedIn: 'root'
})
export class SelectedPropertyService {
  private selectedPropertySubject = new BehaviorSubject<Property | null>(null);
  selectedProperty$ = this.selectedPropertySubject.asObservable();

  setSelectedProperty(property: Property) {
    this.selectedPropertySubject.next(property);
  }

  clearSelectedProperty() {
    this.selectedPropertySubject.next(null);
  }
}