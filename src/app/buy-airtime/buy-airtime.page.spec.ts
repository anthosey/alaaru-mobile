import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BuyAirtimePage } from './buy-airtime.page';

describe('BuyAirtimePage', () => {
  let component: BuyAirtimePage;
  let fixture: ComponentFixture<BuyAirtimePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyAirtimePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BuyAirtimePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
