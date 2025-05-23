import { Component } from '@angular/core';
import { BooksService, IBook } from './books.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  standalone: false
})
export class BooksComponent {
  public isEdit: boolean;
  public isMyEdit: boolean;
  public books$: Observable<Array<IBook>>;
  public myBooks$: Observable<Array<IBook>>;

  constructor(private booksService: BooksService, private router: Router) {
    this.booksService.onGetAllBooks$
      .asObservable()
      .pipe(takeUntilDestroyed())
      .subscribe((value: boolean) => {
        if (value) {
          setTimeout(() => {
            this.getAllBooks();
          }, 300);
        }
      });
  }

  public updateBook(book: IBook): void {
    this.router.navigate(['/books/add-update-book', book]);
  }

  public deleteBook(bookId: string): void {
    this.booksService.deleteBook(bookId).subscribe({
      next: (result: boolean) => {
        if (result) {
          this.getAllBooks();
        }
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {}
    });
  }

  private getAllBooks(): void {
    this.books$ = this.booksService.getAllBooks();
  }
}
