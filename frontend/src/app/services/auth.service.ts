import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private URL = 'http://localhost:3000';

  constructor(private http: HttpClient, private router: Router, @Inject(PLATFORM_ID) private platformId: Object,
              @Inject(DOCUMENT) private document: Document) { }

  signUp(user: { nombre: string; email: string; password1: string; password2: string; isAdmin: boolean; isOperator: boolean}): Observable<any> {
    return this.http.post<any>(`${this.URL}/register`, user).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }

  signIn(user: { email: string; password1: string; }): Observable<any> {
    return this.http.post<any>(`${this.URL}/login`, user).pipe(
      tap(response => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', response.token); // Almacenar token JWT en localStorage si se está en el navegador
          localStorage.setItem('role', response.role);   // Almacenar rol del usuario en localStorage si se está en el navegador
        }
        this.router.navigate(['/home']); // Redirigir al usuario después del inicio de sesión
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  loggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');   
    } else {
      return false;
    }
  }

  getRole(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('role'); 
    } else {
      return null;
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token'); 
    } else {
      return null;
    }
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token'); 
      localStorage.removeItem('role');  
    }
    this.router.navigate(['/home']); 
  }
}
