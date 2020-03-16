import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OperationsInitialPage } from './operations-initial.page';

describe('OperationsInitialPage', () => {
  let component: OperationsInitialPage;
  let fixture: ComponentFixture<OperationsInitialPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationsInitialPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OperationsInitialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
