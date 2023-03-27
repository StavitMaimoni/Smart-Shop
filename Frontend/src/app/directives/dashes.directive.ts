import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCreditCard]'
})

export class DashesDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: { stopPropagation: () => void; }) {
    const initialValue = this.el.nativeElement.value;
    let updatedValue = initialValue.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1-').trim();
    if (updatedValue.endsWith('-')) {
      updatedValue = updatedValue.slice(0, -1);
    }
    this.el.nativeElement.value = updatedValue;
    if ( initialValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
}

}
