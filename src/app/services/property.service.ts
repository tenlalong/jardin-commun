import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PropertyService {
  private refreshProperties = new Subject<void>();
  refreshProperties$ = this.refreshProperties.asObservable();

  triggerRefresh() {
    this.refreshProperties.next();
  }
}