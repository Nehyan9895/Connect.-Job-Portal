import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallNotificationModalComponent } from './call-notification-modal.component';

describe('CallNotificationModalComponent', () => {
  let component: CallNotificationModalComponent;
  let fixture: ComponentFixture<CallNotificationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallNotificationModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CallNotificationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
