import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProcessFundPage } from './process-fund.page';

describe('ProcessFundPage', () => {
  let component: ProcessFundPage;
  let fixture: ComponentFixture<ProcessFundPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessFundPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProcessFundPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
