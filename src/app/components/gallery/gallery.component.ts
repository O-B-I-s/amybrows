import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GalleryItem } from '../../models';
import { GalleryService } from '../../services/gallery.service';

@Component({
  selector: 'app-gallery',
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css',
})
export class GalleryComponent implements OnInit {
  list: GalleryItem[] = [];

  constructor(private gallerySvc: GalleryService) {}

  ngOnInit() {
    this.gallerySvc.getAll().subscribe((x) => (this.list = x));
  }
}
