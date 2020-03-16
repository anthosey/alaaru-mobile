import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AmplifyLoginPage } from './amplify-login.page';

describe('AmplifyLoginPage', () => {
  let component: AmplifyLoginPage;
  let fixture: ComponentFixture<AmplifyLoginPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmplifyLoginPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AmplifyLoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
