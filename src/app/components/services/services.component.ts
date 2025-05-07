import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ServiceService } from '../../services/service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-services',
  imports: [CommonModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css',
})
export class ServicesComponent implements OnInit {
  @ViewChildren('accordionContent') contents!: QueryList<
    ElementRef<HTMLElement>
  >;
  @ViewChild('accordionContent1') accordionContent1!: ElementRef;
  @ViewChild('accordionContent2') accordionContent2!: ElementRef;
  @ViewChild('accordionContent3') accordionContent3!: ElementRef;

  list: any[] = [];

  activeIndex: number | null = null;
  downSVG: SafeHtml;
  upSVG: SafeHtml;
  active: { [svcIdx: number]: number | null } = {};

  constructor(private sanitizer: DomSanitizer, private svc: ServiceService) {
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

  ngOnInit() {
    this.svc.getAll().subscribe((x) => {
      this.list = x;
      // initialize each service’s active accordion to null
      this.list.forEach((_, i) => (this.active[i] = null));
    });
  }

  toggleAccordion(index: number) {
    if (this.activeIndex === index) {
      this.activeIndex = null;
    } else {
      this.activeIndex = index;
    }
  }
  toggle(svcIdx: number, descIdx: number) {
    this.active[svcIdx] = this.active[svcIdx] === descIdx ? null : descIdx;
  }

  // get the actual element for height measurement
  getContentEl(svcIdx: number, descIdx: number): HTMLElement | null {
    // QueryList is flat—deserialize by service index + descIdx
    const flatIdx =
      this.list
        .slice(0, svcIdx)
        .reduce((sum, svc) => sum + svc.descriptions.length, 0) + descIdx;
    return this.contents.toArray()[flatIdx]?.nativeElement || null;
  }

  height(svcIdx: number, descIdx: number): string {
    const el = this.getContentEl(svcIdx, descIdx);
    return el && this.active[svcIdx] === descIdx ? `${el.scrollHeight}px` : '0';
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
