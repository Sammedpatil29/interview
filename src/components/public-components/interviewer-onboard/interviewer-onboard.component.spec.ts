import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewerOnboardComponent } from './interviewer-onboard.component';

describe('InterviewerOnboardComponent', () => {
  let component: InterviewerOnboardComponent;
  let fixture: ComponentFixture<InterviewerOnboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewerOnboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewerOnboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
