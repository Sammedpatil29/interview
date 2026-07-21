import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawFormComponent } from './withdraw-form.component';

describe('WithdrawFormComponent', () => {
  let component: WithdrawFormComponent;
  let fixture: ComponentFixture<WithdrawFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WithdrawFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WithdrawFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
