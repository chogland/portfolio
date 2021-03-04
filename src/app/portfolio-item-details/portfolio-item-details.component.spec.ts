import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PortfolioItemDetailsComponent } from './portfolio-item-details.component';

describe('PortfolioItemDetailsComponent', () => {
  let component: PortfolioItemDetailsComponent;
  let fixture: ComponentFixture<PortfolioItemDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PortfolioItemDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioItemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
