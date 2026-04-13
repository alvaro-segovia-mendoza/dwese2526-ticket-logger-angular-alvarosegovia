import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionEditComponent } from './region-edit';

describe('RegionEditComponent', () => {
  let component: RegionEditComponent;
  let fixture: ComponentFixture<RegionEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegionEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegionEditComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
