import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { AmbulanceService } from '../ambulance.service';
import { AmbulanceResponse, AmbulanceStatus } from '../models/ambulance.model';
import { AddEditAmbulanceDialog } from '../dialogs/add-edit-ambulance.dialog';
import { AddEditDeviceDialog } from '../dialogs/add-edit-device.dialog';
import { AssignDeviceDialog } from '../dialogs/assign-device.dialog';
import { DeviceResponse, DeviceAssignmentRequest, Employee } from '../models/ambulance.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';

@Component({
  selector: 'app-ambulance-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
  ],
  providers: [SnackbarService],
  template: `
    <div class="container mx-auto p-6">
      <div class="relative w-full mb-6">
        <h1 class="text-2xl font-bold">Ambulance Management</h1>
        <div class="absolute top-0 right-0 flex gap-4">
          <button mat-raised-button color="primary" (click)="addDevice()">
            <mat-icon>devices</mat-icon>
            Add Device
          </button>
          <button mat-raised-button color="primary" (click)="assignDeviceDialog()">
              <mat-icon>person_add</mat-icon>
              Assign Device
          </button>
          <button mat-raised-button color="primary" (click)="addAmbulance()">
            <mat-icon>add</mat-icon>
            Register Ambulance
          </button>
        </div>
      </div>

      <!-- Rest of the template remains exactly the same -->
      <div class="flex flex-wrap justify-start gap-4 mb-6">
        <mat-card class="stat-card">
          <mat-card-content class="stat-card-content">
            <div class="flex items-center gap-3">
              <mat-icon class="text-gray-600">directions_car</mat-icon>
              <div>
                <div class="text-sm text-gray-600">Total Ambulances</div>
                <div class="text-2xl font-bold">{{getTotalAmbulances()}}</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content class="stat-card-content">
            <div class="flex items-center gap-3">
              <mat-icon class="text-green-600">check_circle</mat-icon>
              <div>
                <div class="text-sm text-gray-600">Available</div>
                <div class="text-2xl font-bold text-green-600">
                  {{getAmbulancesByStatus(AmbulanceStatus.AVAILABLE)}}
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content class="stat-card-content">
            <div class="flex items-center gap-3">
              <mat-icon class="text-amber-600">local_shipping</mat-icon>
              <div>
                <div class="text-sm text-gray-600">On Mission</div>
                <div class="text-2xl font-bold text-amber-600">{{getActiveAmbulances()}}</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content class="stat-card-content">
            <div class="flex items-center gap-3">
              <mat-icon class="text-red-600">warning</mat-icon>
              <div>
                <div class="text-sm text-gray-600">Out of Service</div>
                <div class="text-2xl font-bold text-red-600">
                  {{getAmbulancesByStatus(AmbulanceStatus.OUT_OF_SERVICE)}}
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-card>
        <mat-card-content>
          <mat-form-field class="w-full">
            <mat-label>Filter</mat-label>
            <input matInput (keyup)="applyFilter($event)" placeholder="Search ambulances..." #input>
          </mat-form-field>

          <div class="mat-elevation-z8">
            <mat-table [dataSource]="dataSource" matSort>
              <ng-container matColumnDef="vehicleNumber">
                <mat-header-cell *matHeaderCellDef mat-sort-header>Vehicle Number</mat-header-cell>
                <mat-cell *matCellDef="let row">{{row.vehicleNumber}}</mat-cell>
              </ng-container>

              <ng-container matColumnDef="status">
                <mat-header-cell *matHeaderCellDef mat-sort-header>Status</mat-header-cell>
                <mat-cell *matCellDef="let row">
                  <mat-chip [color]="getStatusColor(row.status)" selected>
                    {{row.status}}
                  </mat-chip>
                </mat-cell>
              </ng-container>

              <ng-container matColumnDef="currentAssignment">
                <mat-header-cell *matHeaderCellDef mat-sort-header>Current Assignment</mat-header-cell>
                <mat-cell *matCellDef="let row">{{row.currentAssignment || 'None'}}</mat-cell>
              </ng-container>

              <ng-container matColumnDef="location">
                <mat-header-cell *matHeaderCellDef>Location</mat-header-cell>
                <mat-cell *matCellDef="let row">
                  {{ row.currentLatitude && row.currentLongitude ?
                      row.currentLatitude.toFixed(6) + ', ' + row.currentLongitude.toFixed(6) :
                      'Unknown' }}
                </mat-cell>
              </ng-container>

              <ng-container matColumnDef="lastUpdated">
                <mat-header-cell *matHeaderCellDef mat-sort-header>Last Updated</mat-header-cell>
                <mat-cell *matCellDef="let row">{{row.lastUpdated | date:'medium'}}</mat-cell>
              </ng-container>

              <ng-container matColumnDef="actions">
                <mat-header-cell *matHeaderCellDef>Actions</mat-header-cell>
                <mat-cell *matCellDef="let row">
                  <button mat-icon-button color="primary" (click)="editAmbulance(row)" matTooltip="Edit">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="accent" (click)="assignDriver(row)" matTooltip="Assign Driver">
                    <mat-icon>person_add</mat-icon>
                  </button>
                  <button mat-icon-button color="accent" (click)="viewLocation(row)" matTooltip="View Location">
                    <mat-icon>location_on</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="viewHistory(row)" matTooltip="View History">
                    <mat-icon>history</mat-icon>
                  </button>
                </mat-cell>
              </ng-container>

              <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
              <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>

              <tr class="mat-row" *matNoDataRow>
                <td class="mat-cell" colspan="6">No data matching the filter "{{input.value}}"</td>
              </tr>
            </mat-table>

            <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]" aria-label="Select page of ambulances"></mat-paginator>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .stat-card {
      padding: 1rem;
      border-radius: 0.5rem;
      background-color: white;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 220px;
    }

    .stat-card-content {
      padding: 1rem;
    }

    mat-table {
      width: 100%;
    }

    .mat-column-actions {
      @apply flex gap-2;
    }

    .flex {
      display: flex;
    }

    .flex-wrap {
      flex-wrap: wrap;
    }

    .justify-start {
      justify-content: flex-start;
    }

    .gap-4 {
      gap: 1rem;
    }

    .mb-6 {
      margin-bottom: 1.5rem;
    }

    @media (max-width: 768px) {
      .stat-card {
        max-width: 100%;
      }
    }
    .mat-column-status .mat-mdc-chip {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      padding: 4px 12px !important;
      white-space: nowrap !important;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 100px; /* Set a minimum width */
      max-width: 150px; /* Set a maximum width to constrain size */
      height: auto !important;
      font-size: 14px; /* Adjust font size */
    }

    .mat-column-status,
    .mat-column-vehicleNumber,
    .mat-column-currentAssignment,
    .mat-column-location,
    .mat-column-lastUpdated {
      text-align: center;
      justify-content: center;
      padding: 0 8px;
    }

    mat-header-cell {
      justify-content: center;
      text-align: center;
    }

    mat-cell {
      justify-content: center;
      text-align: center;
    }

    .mat-column-actions {
      justify-content: center;
      min-width: 160px;
    }

  `]
})
export class AmbulanceListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  AmbulanceStatus = AmbulanceStatus;
  dataSource: MatTableDataSource<AmbulanceResponse>;
  devicesDataSource: MatTableDataSource<DeviceResponse>;
  displayedColumns = ['vehicleNumber', 'status', 'currentAssignment', 'location', 'lastUpdated', 'actions'];

  constructor(
    private ambulanceService: AmbulanceService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource();
    this.devicesDataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.loadAmbulances();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadAmbulances() {
    this.ambulanceService.getAllAmbulances().subscribe({
      next: (response) => {
        //console.log('API Response:', response);
        if (response.success) {
          this.dataSource.data = response.data; // Extract data from the response
        } else {
          console.error('Failed to load ambulances:', response.message);
        }
      },
      error: (error) => console.error('Error loading ambulances:', error)
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getStatusColor(status: AmbulanceStatus): string {
    const colors: Record<AmbulanceStatus, string> = {
      [AmbulanceStatus.AVAILABLE]: 'primary',
      [AmbulanceStatus.ASSIGNED]: 'accent',
      [AmbulanceStatus.EN_ROUTE]: 'warn',
      [AmbulanceStatus.AT_SCENE]: 'warn',
      [AmbulanceStatus.TRANSPORTING]: 'warn',
      [AmbulanceStatus.AT_HOSPITAL]: 'accent',
      [AmbulanceStatus.OUT_OF_SERVICE]: 'warn'
    };
    return colors[status] || 'default';
  }

  getTotalAmbulances(): number {
    return this.dataSource.data.length;
  }

  getAmbulancesByStatus(status: AmbulanceStatus): number {
    return this.dataSource.data.filter(a => a.status === status).length;
  }

  getActiveAmbulances(): number {
    return this.dataSource.data.filter(a =>
      [AmbulanceStatus.ASSIGNED, AmbulanceStatus.EN_ROUTE,
       AmbulanceStatus.AT_SCENE, AmbulanceStatus.TRANSPORTING].includes(a.status)
    ).length;
  }

  addDevice() {
      const dialogRef = this.dialog.open(AddEditDeviceDialog, {
        width: '500px'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.ambulanceService.registerDevice(result).subscribe({
            next: () => {
              this.snackbarService.showSnackbar('Device registered successfully', 'Close', {
                duration: 3000,
                panelClass: ['success-snackbar']
              });
              this.loadAmbulances();
            },
            error: (error) => {
              console.error('Error registering device:', error);
              this.snackbarService.showSnackbar(error.error?.message || 'Error registering device', 'Close', {
                duration: 5000,
                panelClass: ['error-snackbar']
              });
            }
          });
        }
      });
    }

  addAmbulance() {
    const dialogRef = this.dialog.open(AddEditAmbulanceDialog, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) { // Check for success property instead of just result
        this.loadAmbulances(); // Only reload the list
      }
    });
  }

assignDriver(device: DeviceResponse) {
    const dialogRef = this.dialog.open(AssignDeviceDialog, {
      width: '500px',
      data: device,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ambulanceService.assignDeviceToDriver(result).subscribe({
          next: () => {
            this.snackbarService.showSnackbar('Device assigned successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.loadDevices();
          },
          error: (error) => {
            this.snackbarService.showSnackbar(error.error?.message || 'Error assigning device', 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  editAmbulance(ambulance: AmbulanceResponse) {
    const dialogRef = this.dialog.open(AddEditAmbulanceDialog, {
      width: '600px',
      data: ambulance
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const { id, ...updateData } = result;
        this.ambulanceService.updateAmbulance(ambulance.id, updateData).subscribe({
          next: () => {
            this.loadAmbulances();
            this.snackbarService.showSnackbar('Ambulance updated successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          },
          error: (error) => {
            this.snackbarService.showSnackbar(error.error?.message || 'Error updating ambulance', 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  viewLocation(ambulance: AmbulanceResponse) {
    // Implement location view dialog
  }

  viewHistory(ambulance: AmbulanceResponse) {
    // Implement history view dialog
  }

  loadDevices() {
    this.ambulanceService.getAllDevices().subscribe({
      next: (response) => {
        if (response.success) {
          this.devicesDataSource.data = response.data;
          this.loadAmbulances(); // Refresh ambulances after device update
        }
      },
      error: (error) => console.error('Error loading devices:', error)
    });
  }

assignDeviceDialog() {
    this.ambulanceService.getAllDevices().subscribe({
      next: (response) => {
        if (response.success && response.data.length > 0) {
          const dialogRef = this.dialog.open(AssignDeviceDialog, {
            width: '500px',
            data: response.data[0],
            disableClose: true
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.ambulanceService.assignDeviceToDriver(result).subscribe({
                next: () => {
                  this.snackbarService.showSnackbar('Device assigned successfully', 'Close', {
                    duration: 3000
                  });
                  this.loadAmbulances();
                },
                error: (error) => {
                  this.snackbarService.showSnackbar(error.error?.message || 'Error assigning device', 'Close', {
                    duration: 5000
                  });
                }
              });
            }
          });
        } else {
          this.snackbarService.showSnackbar('No devices available to assign', 'Close', { duration: 3000 });
        }
      }
    });
  }
}

