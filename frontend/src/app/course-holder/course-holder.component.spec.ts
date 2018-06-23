import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseHolderComponent } from './course-holder.component';

describe('CourseHolderComponent', () => {
  let component: CourseHolderComponent;
  let fixture: ComponentFixture<CourseHolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseHolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
