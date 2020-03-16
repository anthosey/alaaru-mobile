import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FundWalletPage } from './fund-wallet.page';

describe('FundWalletPage', () => {
  let component: FundWalletPage;
  let fixture: ComponentFixture<FundWalletPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundWalletPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FundWalletPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
