import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutFormComponent } from './payout-form.component';

describe('PayoutFormComponent', () => {
  let component: PayoutFormComponent;
  let fixture: ComponentFixture<PayoutFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayoutFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayoutFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
