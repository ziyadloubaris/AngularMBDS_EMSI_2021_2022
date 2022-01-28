import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appNonrendu]'
})
export class NonrenduDirective {

  constructor(el:ElementRef) {
    el.nativeElement.style.color = 'red';
    el.nativeElement.style.border = '1px solid pink';
    el.nativeElement.style.backgroundColor = 'lightpink';
  }

}
