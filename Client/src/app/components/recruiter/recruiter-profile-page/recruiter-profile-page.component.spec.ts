import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterProfilePageComponent } from './recruiter-profile-page.component';

describe('RecruiterProfilePageComponent', () => {
  let component: RecruiterProfilePageComponent;
  let fixture: ComponentFixture<RecruiterProfilePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecruiterProfilePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecruiterProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
