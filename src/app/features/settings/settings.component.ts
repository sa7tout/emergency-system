import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
 selector: 'app-settings',
 standalone: true,
 imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
 template: `
   <div class="p-6">
     <mat-card class="max-w-lg mx-auto">
       <mat-card-header>
         <mat-icon mat-card-avatar>settings</mat-icon>
         <mat-card-title>Account Settings</mat-card-title>
         <mat-card-subtitle>Manage your account information</mat-card-subtitle>
       </mat-card-header>

       <mat-card-content class="p-4">
         <div class="space-y-4">
           <div>
             <label class="text-gray-600">Username</label>
             <p class="text-lg font-medium">{{userInfo?.username}}</p>
           </div>
           <div>
             <label class="text-gray-600">Email</label>
             <p class="text-lg font-medium">{{userInfo?.email}}</p>
           </div>
           <div>
             <label class="text-gray-600">Role</label>
             <p class="text-lg font-medium">{{userInfo?.roles?.join(', ')}}</p>
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

 constructor(
   private authService: AuthService,
   private router: Router
 ) {
   const userData = localStorage.getItem('user');
   if (userData) {
     this.userInfo = JSON.parse(userData);
   }
 }

 logout(): void {
   this.authService.logout();
   this.router.navigate(['/login']);
 }
}
