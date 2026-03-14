import { Component, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
})
export class FilterDialogComponent {
  selectedPriorities: string[] = [];
  startDate: Date | null = null;
  endDate: Date | null = null;

  constructor(
    private translate:TranslateService,
    public dialogRef: MatDialogRef<FilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dateAdapter: DateAdapter<any>
  ) {}

  ngOnInit(): void {
    this.selectedPriorities = [...this.data.initialSelectedPriorities];
    this.startDate = this.data.initialStartDate;
    this.endDate = this.data.initialEndDate;

    this.translate.onLangChange.subscribe(() => {
      this.updateDateLocale();
    });

    this.updateDateLocale();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  applyFilter(): void {
    this.dialogRef.close({
      selectedPriorities: this.selectedPriorities,
      startDate: this.startDate,
      endDate: this.endDate,
    });
  }

  resetFilter(): void {
    this.selectedPriorities = [];
    this.startDate = null;
    this.endDate = null;
  }

  updateDateLocale(): void {
    const currentLang = (sessionStorage.getItem('lang') ?? 'en') as 'en' | 'sr' | 'fr';
    const localeMapping = {
      en: 'en',
      sr: 'sr-Latn',
      fr: 'fr'
    };
    const locale = localeMapping[currentLang] || 'en';
    // this.translate.setDefaultLang(currentLang);
    // this.translate.use(currentLang);
    this.dateAdapter.setLocale(locale);
  }

}
