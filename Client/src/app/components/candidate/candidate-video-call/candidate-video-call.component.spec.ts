import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateVideoCallComponent } from './candidate-video-call.component';

describe('CandidateVideoCallComponent', () => {
  let component: CandidateVideoCallComponent;
  let fixture: ComponentFixture<CandidateVideoCallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateVideoCallComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CandidateVideoCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
