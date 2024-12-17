@Component({
  template: `
    <h2 mat-dialog-title>Update Hospital Capacity</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <div class="grid gap-4">
          <mat-form-field>
            <mat-label>Available Beds</mat-label>
            <input matInput type="number" formControlName="availableBeds">
            <mat-hint>Total beds: {{data.totalBeds}}</mat-hint>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Current Emergency Load</mat-label>
            <input matInput type="number" formControlName="currentLoad">
            <mat-hint>Emergency capacity: {{data.emergencyCapacity}}</mat-hint>
          </mat-form-field>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
          Update
        </button>
      </mat-dialog-actions>
    </form>
  `
})
export class UpdateCapacityDialog {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UpdateCapacityDialog>,
    @Inject(MAT_DIALOG_DATA) public data: HospitalResponse
  ) {
    this.form = this.fb.group({
      availableBeds: [data.availableBeds, [
        Validators.required,
        Validators.min(0),
        Validators.max(data.totalBeds)
      ]],
      currentLoad: [data.currentEmergencyLoad, [
        Validators.required,
        Validators.min(0),
        Validators.max(data.emergencyCapacity)
      ]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
