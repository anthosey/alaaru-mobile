import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InterCityPage } from './inter-city.page';

describe('InterCityPage', () => {
  let component: InterCityPage;
  let fixture: ComponentFixture<InterCityPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterCityPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InterCityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
