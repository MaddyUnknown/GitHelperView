import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitUnitComponent } from './commit-unit.component';

describe('CommitUnitComponent', () => {
  let component: CommitUnitComponent;
  let fixture: ComponentFixture<CommitUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommitUnitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommitUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
