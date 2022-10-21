import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitGraphComponent } from './commit-graph.component';

describe('CommitGraphComponent', () => {
  let component: CommitGraphComponent;
  let fixture: ComponentFixture<CommitGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommitGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommitGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
