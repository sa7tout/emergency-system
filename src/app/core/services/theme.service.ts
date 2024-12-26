import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkTheme = new BehaviorSubject<boolean>(localStorage.getItem('theme') === 'dark');

  isDarkTheme$ = this.isDarkTheme.asObservable();

  setTheme(theme: string) {
    localStorage.setItem('theme', theme);
    document.body.classList.toggle('dark-theme', theme === 'dark');
    this.isDarkTheme.next(theme === 'dark');
  }

  getCurrentTheme() {
    return localStorage.getItem('theme') || 'light';
  }
}
