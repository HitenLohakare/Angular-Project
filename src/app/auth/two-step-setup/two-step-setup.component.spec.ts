import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoStepSetupComponent } from './two-step-setup.component';

describe('TwoStepSetupComponent', () => {
  let component: TwoStepSetupComponent;
  let fixture: ComponentFixture<TwoStepSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TwoStepSetupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TwoStepSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
