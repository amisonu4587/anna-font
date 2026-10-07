import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  templateUrl: './pagination.html',
  styleUrl: './pagination.css'
})
export class Pagination {

  @Input() currentPage = 1;
  @Input() totalItems = 0;
  @Input() pageSize = 10;

  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }


  get startItem(): number {

    if (this.totalItems === 0) {
      return 0;
    }

    return (this.currentPage - 1) * this.pageSize + 1;
  }



  get endItem(): number {

    return Math.min(
      this.currentPage * this.pageSize,
      this.totalItems
    );
  }



  get pages(): (number | string)[] {

    const total = this.totalPages;
    const current = this.currentPage;

    if (total <= 0) {
      return [];
    }


    if (total <= 7) {

      return Array.from(
        { length: total },
        (_, index) => index + 1
      );
    }


    const pages: (number | string)[] = [];



    pages.push(1);




    if (current <= 4) {

      pages.push(2);
      pages.push(3);
      pages.push(4);
      pages.push(5);

      pages.push('...');

      pages.push(total);

      return pages;
    }



    if (current >= total - 3) {

      pages.push('...');

      pages.push(total - 4);
      pages.push(total - 3);
      pages.push(total - 2);
      pages.push(total - 1);
      pages.push(total);

      return pages;
    }



    pages.push('...');

    pages.push(current - 1);
    pages.push(current);
    pages.push(current + 1);

    pages.push('...');

    pages.push(total);


    return pages;
  }



  isPageNumber(
    page: number | string
  ): page is number {

    return typeof page === 'number';
  }



  goToPage(page: number): void {

    if (
      page < 1 ||
      page > this.totalPages ||
      page === this.currentPage
    ) {
      return;
    }

    this.pageChange.emit(page);
  }


  previous(): void {

    if (this.currentPage > 1) {

      this.goToPage(
        this.currentPage - 1
      );
    }
  }



  next(): void {

    if (this.currentPage < this.totalPages) {

      this.goToPage(
        this.currentPage + 1
      );
    }
  }
}