import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  readonly categories: string[] = ['Indicies', 'Energies', 'Metals', 'Currency'];

  private selectedSet = new Set<string>();
  private selectedSubject = new BehaviorSubject<string[]>([]);

  selectedCategories$ = this.selectedSubject.asObservable();

  toggle(categoryName: string): void {
    if (this.selectedSet.has(categoryName)) {
      this.selectedSet.delete(categoryName);
    } else {
      this.selectedSet.add(categoryName);
    }
    this.selectedSubject.next([...this.selectedSet]);
  }

  selectAll(): void {
    this.selectedSet.clear();
    for (const cat of this.categories) {
      this.selectedSet.add(cat);
    }
    this.selectedSubject.next([...this.selectedSet]);
  }

  isSelected(categoryName: string): boolean {
    return this.selectedSet.has(categoryName);
  }
}
