import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap } from 'rxjs';

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    username: string;
    roles: string[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = '/emergency/api/v1/auth';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.isAuthenticatedSubject.next(!!localStorage.getItem('token'));
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/admin/login`, {
      username,
      password
    }).pipe(
      tap(response => {
        if (response.success && response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data));
          this.isAuthenticatedSubject.next(true);
        }
      }),
      catchError(error => {
        if (error.error?.message === 'Bad credentials') {
          throw new Error('Invalid credentials');
        } else if (error.status === 401) {
          throw new Error('Invalid credentials');
        } else if (error.status === 500) {
          throw new Error('Server error - please try again later');
        } else if (!navigator.onLine) {
          throw new Error('No internet connection');
        } else {
          throw error.error?.message || 'Unable to connect to server';
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
