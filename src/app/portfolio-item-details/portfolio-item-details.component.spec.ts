import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioItemDetailsComponent } from './portfolio-item-details.component';

describe('PortfolioItemDetailsComponent', () => {
  let component: PortfolioItemDetailsComponent;
  let fixture: ComponentFixture<PortfolioItemDetailsComponent>;

  beforeEach(async(() => {
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
