import { Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-services',
  imports: [],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css',
})
export class ServicesComponent {
  @ViewChild('accordionContent1') accordionContent1!: ElementRef;
  @ViewChild('accordionContent2') accordionContent2!: ElementRef;
  @ViewChild('accordionContent3') accordionContent3!: ElementRef;

  activeIndex: number | null = null;
  downSVG: SafeHtml;
  upSVG: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {
    this.downSVG = this.sanitizer.bypassSecurityTrustHtml(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4">
        <path fill-rule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"/>
      </svg>
    `);

    this.upSVG = this.sanitizer.bypassSecurityTrustHtml(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4">
        <path fill-rule="evenodd" d="M11.78 9.78a.75.75 0 0 1-1.06 0L8 7.06 5.28 9.78a.75.75 0 0 1-1.06-1.06l3.25-3.25a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06Z" clip-rule="evenodd"/>
      </svg>
    `);
  }

  toggleAccordion(index: number) {
    if (this.activeIndex === index) {
      this.activeIndex = null;
    } else {
      this.activeIndex = index;
    }
  }

  getAccordionContent(index: number): HTMLElement | null {
    switch (index) {
      case 1:
        return this.accordionContent1?.nativeElement;
      case 2:
        return this.accordionContent2?.nativeElement;
      case 3:
        return this.accordionContent3?.nativeElement;
      default:
        return null;
    }
  }
}
