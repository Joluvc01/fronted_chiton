import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferencedetailComponent } from './referencedetail.component';

describe('ReferencedetailComponent', () => {
  let component: ReferencedetailComponent;
  let fixture: ComponentFixture<ReferencedetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReferencedetailComponent]
    });
    fixture = TestBed.createComponent(ReferencedetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
