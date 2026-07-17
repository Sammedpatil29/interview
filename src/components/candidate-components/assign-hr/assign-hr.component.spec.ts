import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignHrComponent } from './assign-hr.component';

describe('AssignHrComponent', () => {
  let component: AssignHrComponent;
  let fixture: ComponentFixture<AssignHrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignHrComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignHrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
