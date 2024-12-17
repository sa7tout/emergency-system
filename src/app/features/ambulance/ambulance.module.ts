import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/material.module';
import { GoogleMapsModule } from '@angular/google-maps';

import { AmbulanceListComponent } from './ambulance-list/ambulance-list.component';
import { AddEditAmbulanceDialog } from './dialogs/add-edit-ambulance.dialog';
import { LocationHistoryDialog } from './dialogs/location-history.dialog';
import { ambulanceRoutes } from './ambulance.routes';
import { AmbulanceService } from './ambulance.service';

@NgModule({
  declarations: [
    AmbulanceListComponent,
    AddEditAmbulanceDialog,
    LocationHistoryDialog
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    GoogleMapsModule,
    RouterModule.forChild(ambulanceRoutes)
  ],
  providers: [AmbulanceService]
})
export class AmbulanceModule { }
