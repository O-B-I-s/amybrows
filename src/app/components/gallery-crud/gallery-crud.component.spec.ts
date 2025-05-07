import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryCrudComponent } from './gallery-crud.component';

describe('GalleryCrudComponent', () => {
  let component: GalleryCrudComponent;
  let fixture: ComponentFixture<GalleryCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryCrudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalleryCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
