import { Pipe, PipeTransform } from '@angular/core';
import { item } from '../item';
@Pipe({
    
    name: 'selectedItem'
})
export class SelectedProductPipe implements PipeTransform {
    transform(allItems: item[], itemId: number): any {
        return allItems.filter(i => i.id === itemId);
    }
}