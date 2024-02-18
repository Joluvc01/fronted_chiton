import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterid'
})
export class FilterIdPipe implements PipeTransform {
  transform(items: any[], field: string, value: any, idFilter: string): any[] {
    const parsedId = parseInt(idFilter);
    if (!items) {
      return [];
    }

    return items.filter(item => {
      const fieldValue = item[field];
      const fieldMatch = value ? fieldValue === value : true;
      const idMatch = parsedId ? item.id === parsedId : true;
      return fieldMatch && idMatch;
    });
  }
}
