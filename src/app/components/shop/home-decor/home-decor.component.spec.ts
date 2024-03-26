import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HomeDecorComponent } from './home-decor.component';

describe('HomeDecorComponent', () => {
  let component: HomeDecorComponent;
  let fixture: ComponentFixture<HomeDecorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeDecorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeDecorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
