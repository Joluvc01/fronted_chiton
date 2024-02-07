import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], field: string, value: any, nameFilter: string): any[] {
    if (!items) {
      return [];
    }
    return items.filter(item => {
      const fieldValue = item[field].toLowerCase();
      const fieldMatch = value ? fieldValue === value.toLowerCase() : true;
      const nameMatch = nameFilter ? item.name.toLowerCase().includes(nameFilter.toLowerCase()) : true;
      return fieldMatch && nameMatch;
    });
  }
}

