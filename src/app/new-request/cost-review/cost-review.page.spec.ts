import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CostReviewPage } from './cost-review.page';

describe('CostReviewPage', () => {
  let component: CostReviewPage;
  let fixture: ComponentFixture<CostReviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostReviewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CostReviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
