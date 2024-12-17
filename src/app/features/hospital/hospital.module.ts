@NgModule({
  declarations: [
    HospitalListComponent,
    AddEditHospitalDialog,
    UpdateCapacityDialog,
    HospitalMapDialog
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    GoogleMapsModule,
    RouterModule.forChild(hospitalRoutes)
  ],
  providers: [HospitalService]
})
export class HospitalModule { }
