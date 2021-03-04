import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PortfolioItemComponent } from './portfolio-item.component';

describe('PortfolioItemComponent', () => {
  let component: PortfolioItemComponent;
  let fixture: ComponentFixture<PortfolioItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PortfolioItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
