import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'stringify'})
export class Json2String implements PipeTransform {
  transform(value: object) {
    return JSON.stringify(value);
  }
}

@Pipe({name: 'string2json'})
export class String2Json implements PipeTransform {
  transform(value: string) {
    return JSON.parse(value);
  }
}

