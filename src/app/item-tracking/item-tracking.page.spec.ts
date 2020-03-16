import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ItemTrackingPage } from './item-tracking.page';

describe('ItemTrackingPage', () => {
  let component: ItemTrackingPage;
  let fixture: ComponentFixture<ItemTrackingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemTrackingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ItemTrackingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
