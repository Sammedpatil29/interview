import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionRequestsComponent } from './transaction-requests.component';

describe('TransactionRequestsComponent', () => {
  let component: TransactionRequestsComponent;
  let fixture: ComponentFixture<TransactionRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
