import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Header0Component } from './header0.component';

describe('Header0Component', () => {
  let component: Header0Component;
  let fixture: ComponentFixture<Header0Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Header0Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Header0Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
