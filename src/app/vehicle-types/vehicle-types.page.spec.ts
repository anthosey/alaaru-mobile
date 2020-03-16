import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VehicleTypesPage } from './vehicle-types.page';

describe('VehicleTypesPage', () => {
  let component: VehicleTypesPage;
  let fixture: ComponentFixture<VehicleTypesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleTypesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleTypesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
