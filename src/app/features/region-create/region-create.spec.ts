import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionCreate } from './region-create';

describe('RegionCreate', () => {
  let component: RegionCreate;
  let fixture: ComponentFixture<RegionCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegionCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegionCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
