import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRecruiterProfileModalComponent } from './edit-recruiter-profile-modal.component';

describe('EditRecruiterProfileModalComponent', () => {
  let component: EditRecruiterProfileModalComponent;
  let fixture: ComponentFixture<EditRecruiterProfileModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditRecruiterProfileModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditRecruiterProfileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
