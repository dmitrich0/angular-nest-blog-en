import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBlogEntryComponent } from './create-blog-entry.component';

describe('CreateBlogEntryComponent', () => {
  let component: CreateBlogEntryComponent;
  let fixture: ComponentFixture<CreateBlogEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateBlogEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateBlogEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
