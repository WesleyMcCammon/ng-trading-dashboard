import { Component, Input } from '@angular/core';
import { CategoryService } from '../../service/category-service';

@Component({
  selector: 'app-category-selector-component',
  imports: [],
  templateUrl: './category-selector-component.html',
  styleUrl: './category-selector-component.css',
})
export class CategorySelectorComponent {
  @Input() categoryName: string = '';

  constructor(private categoryService: CategoryService) {}

  get isSelected(): boolean {
    return this.categoryService.isSelected(this.categoryName);
  }

  toggle(): void {
    this.categoryService.toggle(this.categoryName);
  }
}
