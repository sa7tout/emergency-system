import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
 selector: 'app-settings',
 standalone: true,
 imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatSlideToggleModule],
 template: `
   <div class="p-6">
     <mat-card class="max-w-lg mx-auto">
       <mat-card-header>
         <mat-icon mat-card-avatar>settings</mat-icon>
         <mat-card-title>Account Settings</mat-card-title>
         <mat-card-subtitle>View your account information</mat-card-subtitle>
         <div class="flex-spacer"></div>
         <div class="flex items-center gap-3">
             <mat-icon class="text-gray-500">{{ isDarkMode ? 'dark_mode' : 'light_mode' }}</mat-icon>
             <mat-slide-toggle
               [checked]="isDarkMode"
               (change)="toggleTheme()"
               color="primary">
             </mat-slide-toggle>
           </div>
       </mat-card-header>

       <mat-card-content class="p-4">
         <div class="grid gap-6">
           <div class="info-box p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all">
             <div class="flex items-center gap-3 mb-2">
               <mat-icon class="text-gray-500">person</mat-icon>
               <label class="text-gray-600 font-medium">Username</label>
             </div>
             <p class="text-lg font-medium pl-9">{{userInfo?.username}}</p>
           </div>

           <div class="info-box p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all">
             <div class="flex items-center gap-3 mb-2">
               <mat-icon class="text-gray-500">email</mat-icon>
               <label class="text-gray-600 font-medium">Email</label>
             </div>
             <p class="text-lg font-medium pl-9">{{userInfo?.email}}</p>
           </div>

           <div class="info-box p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all">
             <div class="flex items-center gap-3 mb-2">
               <mat-icon class="text-gray-500">badge</mat-icon>
               <label class="text-gray-600 font-medium">Role</label>
             </div>
             <p class="text-lg font-medium pl-9">{{userInfo?.roles?.join(', ')}}</p>
           </div>
         </div>
       </mat-card-content>

       <mat-card-actions align="end" class="p-4">
         <button mat-raised-button color="warn" (click)="logout()">
           <mat-icon>exit_to_app</mat-icon>
           Logout
         </button>
       </mat-card-actions>
     </mat-card>
   </div>
 `
})
export class SettingsComponent {
 userInfo: any;
 isDarkMode = localStorage.getItem('theme') === 'dark';

 constructor(
   private authService: AuthService,
   private router: Router,
   private themeService: ThemeService
 ) {
   const userData = localStorage.getItem('user');
   if (userData) {
     this.userInfo = JSON.parse(userData);
   }
 }

 toggleTheme(): void {
   this.isDarkMode = !this.isDarkMode;
   this.themeService.setTheme(this.isDarkMode ? 'dark' : 'light');
 }

 logout(): void {
   this.authService.logout();
   this.router.navigate(['/login']);
 }
}
