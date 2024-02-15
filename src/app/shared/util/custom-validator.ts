import { AbstractControl, AsyncValidatorFn, FormControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CategoryService } from '../services/category.service';

export class CustomValidators {
  static categoryExistsValidator(service: CategoryService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const name = control.value;
      if (!name) {
        return of(null);
      }
      
      return service.checkCategoryExists(name).pipe(
        map(exists => (exists ? null : { categoryExists: true })),
        catchError(() => of(null)) // Maneja el error y retorna null
      );
    };
  }
}
