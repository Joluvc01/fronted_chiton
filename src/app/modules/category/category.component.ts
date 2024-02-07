import { Component } from '@angular/core';
import { ICategory } from 'src/app/core/models/category.model';
import { CategoryService } from 'src/app/shared/services/category.service';
import { faPen, faThumbTack, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent {

  categoryList: ICategory[] = [];
  p: number = 1;
  filterName = '';
  filterField = ''
  faPen = faPen;
  faThumbTack = faThumbTack;
  faTrash = faTrash

  constructor(private _apiService: CategoryService) {}

  ngOnInit(): void {
    console.log(this.filterName);
    console.log(this.filterField);
    
    this._apiService.getAllCategories().subscribe(data => {
      this.categoryList = data;
    })
  }
}
