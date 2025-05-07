import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionsCrudComponent } from './descriptions-crud.component';

describe('DescriptionsCrudComponent', () => {
  let component: DescriptionsCrudComponent;
  let fixture: ComponentFixture<DescriptionsCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescriptionsCrudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DescriptionsCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
