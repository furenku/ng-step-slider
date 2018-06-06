import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepSliderComponent } from './step-slider.component';

describe('StepSliderComponent', () => {
  let component: StepSliderComponent;
  let fixture: ComponentFixture<StepSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
