import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

@Injectable()
export class CustomPaginatorIntl extends MatPaginatorIntl {
  override changes = new Subject<void>();

  constructor(private translate: TranslateService) {
    super();
    this.initTranslations();
    this.translate.onLangChange.subscribe(() => {
      this.initTranslations();
      this.changes.next();
    });
  }

  initTranslations() {
    this.itemsPerPageLabel = this.translate.instant('Items per page');
    this.nextPageLabel = this.translate.instant('Next page');
    this.previousPageLabel = this.translate.instant('Previous page');
    this.firstPageLabel = this.translate.instant('First page');
    this.lastPageLabel = this.translate.instant('Last page');
    this.changes.next();
  }

  override getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) {
      return `0 ${this.translate.instant('of')} ${length}`;
    }
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} ${this.translate.instant('of')} ${length}`;
  };
}
