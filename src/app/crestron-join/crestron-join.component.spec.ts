import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrestronJoinComponent } from './crestron-join.component';

describe('CrestronJoinComponent', () => {
  let component: CrestronJoinComponent;
  let fixture: ComponentFixture<CrestronJoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrestronJoinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrestronJoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
