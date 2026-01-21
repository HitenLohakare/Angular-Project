import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportExportData } from './import-export-data';

describe('ImportExportData', () => {
  let component: ImportExportData;
  let fixture: ComponentFixture<ImportExportData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportExportData]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportExportData);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
