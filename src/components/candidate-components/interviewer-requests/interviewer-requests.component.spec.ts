import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewerRequestsComponent } from './interviewer-requests.component';

describe('InterviewerRequestsComponent', () => {
  let component: InterviewerRequestsComponent;
  let fixture: ComponentFixture<InterviewerRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewerRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewerRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
