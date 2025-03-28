import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Observable } from 'rxjs';

export interface IBook {
  author: string;
  bookName: string;
  category: string;
  id: string;
  price?: number;
  iconId: string;
  iconPath?: string;
  // icon: FormData;
  icon: File;
}

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html',
  standalone: false
})
export class FetchDataComponent implements OnInit {
  public isEdit: boolean;
  public isMyEdit: boolean;
  public myFile: FormData;
  public books$: Observable<Array<IBook>>;
  public myBooks$: Observable<Array<IBook>>;
  public newBook: IBook = {
    id: '',
    bookName: 'bookName',
    author: 'author',
    category: 'category',
    price: 123,
    icon: null,
    iconId: null
  };
  public newMyBook: IBook = {
    id: null,
    bookName: null,
    author: null,
    category: null,
    price: null,
    icon: null,
    iconId: null
  };
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.getAllBooks();
  }

  public deleteBook(bookId: string): void {
    this.apiService.deleteBook(bookId).subscribe({
      next: (result) => {
        this.getAllBooks();
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {}
    });
  }

  public addOneBook(): void {
    this.apiService.addOneBook(this.newBook).subscribe({
      next: (result) => {
        this.newBook = {
          id: null,
          bookName: null,
          author: null,
          category: null,
          price: null,
          icon: null,
          iconId: null
        };
        this.getAllBooks();
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {}
    });
  }

  public updateOneBook(bookId: string): void {
    this.apiService
      .updateOneBook(bookId, this.newBook)

      .subscribe({
        next: (result) => {
          this.newBook = {
            id: null,
            bookName: null,
            author: null,
            category: null,
            price: null,
            iconId: null,
            icon: null
          };
          this.getAllBooks();
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {}
      });
  }

  private getAllBooks(): void {
    this.books$ = this.apiService.getAllBooks();
  }

  public uploadFile(): void {
    this.apiService
      .uploadFile(this.myFile)

      .subscribe({
        next: (result) => {},
        error: (err) => {
          console.error(err);
        },
        complete: () => {}
      });
  }
}
