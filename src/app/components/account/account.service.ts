import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, of, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface IUser {
  email: string;
  userName: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.baseUrl;

  mongoUrl = 'http://localhost:5325/api/v1/authenticate/login'
  
  private currentUserSource = new ReplaySubject<IUser | null>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  public loadCurrentUser(token: string | null) {
    if (token == null) {

      this.currentUserSource.next(null);

      return of(null);
    }

    let headers = new HttpHeaders();

    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.get<IUser>(this.baseUrl + 'account', {headers}).pipe(
      map((user: IUser) => {
        if (user) {

          localStorage.setItem('postgre-token', user.token);
          // localStorage.setItem('mongo-token', any.accessToken);

          this.currentUserSource.next(user);

          return user;

        } else {

          return null;
        }
      })
    )
  }

  login(values: any) {

   // return this.http.post<any>(this.mongoUrl, values).pipe(
    return this.http.post<any>(this.baseUrl + 'Account/login', values).pipe(
      map(any => {

        localStorage.setItem('postgre-token', any.token);
      // localStorage.setItem('mongo-token', any.accessToken);

        console.log(any);

       // this.currentUserSource.next(any);
      })
    )
  }

  register(values: any) {
    return this.http.post<any>(this.baseUrl + 'account/register', values).pipe(
      map(any => {

        localStorage.setItem('token', any.token);

        this.currentUserSource.next(any);
      })
    )
  }

  logout() {
    localStorage.removeItem('token');
    
    this.currentUserSource.next(null);

    this.router.navigateByUrl('auth/login');
  }

  checkEmailExists(email: string) {
    return this.http.get<boolean>(this.baseUrl + 'account/emailExists?email=' + email);
  }

  getanyAddress() {
    return this.http.get<any>(this.baseUrl + 'account/address');
  }

  updateanyAddress(address: any) {
    return this.http.put(this.baseUrl + 'account/address', address);
  }
}
