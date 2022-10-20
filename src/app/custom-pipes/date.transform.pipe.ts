import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'string2date'})
export class String2Date implements PipeTransform {
  transform(value: string) {
    return new Date(value);
  }
}