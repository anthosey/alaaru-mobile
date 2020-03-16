import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProcessAirtimePage } from './process-airtime.page';

describe('ProcessAirtimePage', () => {
  let component: ProcessAirtimePage;
  let fixture: ComponentFixture<ProcessAirtimePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessAirtimePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProcessAirtimePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
