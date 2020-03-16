import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StartAlaaruPage } from './start-alaaru.page';

describe('StartAlaaruPage', () => {
  let component: StartAlaaruPage;
  let fixture: ComponentFixture<StartAlaaruPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartAlaaruPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StartAlaaruPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
