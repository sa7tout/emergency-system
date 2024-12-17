@Component({
  template: `
    <h2 mat-dialog-title>{{data ? 'Edit' : 'Add'}} Hospital</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <div class="grid grid-cols-2 gap-4">
          <mat-form-field class="col-span-2">
            <mat-label>Name</mat-label>
            <input matInput formControlName="name">
          </mat-form-field>

          <mat-form-field class="col-span-2">
            <mat-label>Address</mat-label>
            <input matInput formControlName="address">
          </mat-form-field>

          <mat-form-field>
            <mat-label>Latitude</mat-label>
            <input matInput type="number" formControlName="latitude">
          </mat-form-field>

          <mat-form-field>
            <mat-label>Longitude</mat-label>
            <input matInput type="number" formControlName="longitude">
          </mat-form-field>

          <mat-form-field>
            <mat-label>Total Beds</mat-label>
            <input matInput type="number" formControlName="totalBeds">
          </mat-form-field>

          <mat-form-field>
            <mat-label>Emergency Capacity</mat-label>
            <input matInput type="number" formControlName="emergencyCapacity">
          </mat-form-field>

          <mat-form-field class="col-span-2">
            <mat-label>Specialties</mat-label>
            <mat-chip-list #chipList>
              <mat-chip *ngFor="let specialty of specialties"
                       [removable]="true" (removed)="removeSpecialty(specialty)">
                {{specialty}}
                <mat-icon matChipRemove>cancel</mat-icon>
              </mat-chip>
              <input placeholder="Add specialty..."
                     [matChipInputFor]="chipList"
                     (matChipInputTokenEnd)="addSpecialty($event)">
            </mat-chip-list>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Contact Number</mat-label>
            <input matInput formControlName="contactNumber">
          </mat-form-field>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
          {{data ? 'Update' : 'Add'}}
        </button>
      </mat-dialog-actions>
    </form>
  `
})
export class AddEditHospitalDialog {
  form: FormGroup;
  specialties: string[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddEditHospitalDialog>,
    @Inject(MAT_DIALOG_DATA) public data: HospitalResponse
  ) {
    this.form = this.fb.group({
      name: [data?.name || '', Validators.required],
      address: [data?.address || '', Validators.required],
      latitude: [data?.latitude || '', [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitude: [data?.longitude || '', [Validators.required, Validators.min(-180), Validators.max(180)]],
      totalBeds: [data?.totalBeds || 0, [Validators.required, Validators.min(0)]],
      emergencyCapacity: [data?.emergencyCapacity || 0, [Validators.required, Validators.min(0)]],
      contactNumber: [data?.contactNumber || '', [Validators.required, Validators.pattern(/^\+?[0-9\s-()]+$/)]]
    });

    if (data?.specialties) {
      this.specialties = data.specialties.split(',').map(s => s.trim());
    }
  }

  addSpecialty(event: MatChipInputEvent) {
    const value = (event.value || '').trim();
    if (value) {
      this.specialties.push(value);
      event.chipInput!.clear();
    }
  }

  removeSpecialty(specialty: string) {
    const index = this.specialties.indexOf(specialty);
    if (index >= 0) {
      this.specialties.splice(index, 1);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      formValue.specialties = this.specialties.join(', ');
      this.dialogRef.close(formValue);
    }
  }
}
