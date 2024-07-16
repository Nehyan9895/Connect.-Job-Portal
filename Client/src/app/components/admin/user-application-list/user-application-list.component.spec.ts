import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserApplicationListComponent } from './user-application-list.component';

describe('UserApplicationListComponent', () => {
  let component: UserApplicationListComponent;
  let fixture: ComponentFixture<UserApplicationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserApplicationListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserApplicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
